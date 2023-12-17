# backend/main.py
from ast import List
import datetime
import os
from fastapi import Depends, FastAPI, HTTPException, Request, UploadFile, File
from pydantic import BaseModel
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
import secrets

app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://nextjs-fastapi-ilycmrtzr-sonah5009.vercel.app",
                   "https://nextjs-fastapi-lilac.vercel.app"],  # 프론트엔드 서버 URL
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)


def create_database_and_tables():
    # 데이터베이스 연결 생성
    conn = sqlite3.connect('kakao.db')

    # 커서 생성
    c = conn.cursor()

    # 테이블 생성
    c.execute('''
        CREATE TABLE IF NOT EXISTS user_table (
            user_key INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    ''')

    # 테이블 생성
    c.execute('''
        CREATE TABLE IF NOT EXISTS chat_room_personal_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_key INTEGER,
            room_name TEXT,
            user_key INTEGER,
            friend_key INTEGER
        )
    ''')

    # 테이블 생성
    c.execute('''
        CREATE TABLE IF NOT EXISTS friend_table (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            friend_key INTEGER,
            friend_name TEXT,
            user_key INTEGER
        )
    ''')

    # 테이블 생성
    # reply_key: Null 이면 넘기고, message key 넣기
    # message_type: 0:text, 1: photo, 2: picture
    c.execute('''
        CREATE TABLE IF NOT EXISTS message_table (
            message_key INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT,
            room_key INTEGER,
            user_key INTEGER,
            time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reply_key INTEGER,
            message_type INTEGER,
            content_path TEXT
        )
    ''')

    # 변경사항 커밋
    conn.commit()

    # 연결 종료
    conn.close()


@app.on_event("startup")
async def startup_event():
    # 애플리케이션 시작 시 데이터베이스 및 테이블 생성
    create_database_and_tables()


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/login")
async def login(login_request: LoginRequest):
    # SQLite 데이터베이스에 연결
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()

    # 사용자 정보 확인

    cursor.execute('''SELECT * FROM user_table WHERE username = ? AND password = ?''',
                   (login_request.username, login_request.password))

    user = cursor.fetchone()

    if user:
        token = secrets.token_hex()
        return {"message": "Login successful", "user_key": user[0], "token": token}
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")
        # return {"message": "Login failed"}


class SignupRequest(BaseModel):
    username: str
    password: str


@app.post("/signup")
async def signup(signup_request: SignupRequest):
    # SQLite 데이터베이스에 연결
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()

    # 동일한 사용자 이름이 이미 있는지 확인
    cursor.execute("SELECT * FROM user_table WHERE username = ?",
                   (signup_request.username,))
    if cursor.fetchone():
        # raise HTTPException(status_code=400, detail="Username already taken")
        return {"error": "Username already taken"}

    # 새로운 사용자 정보 삽입
    cursor.execute("INSERT INTO user_table (username, password) VALUES (?, ?)",
                   (signup_request.username, signup_request.password))

    # friend_table 에 자신의 이름 삽입
    cursor.execute(
        "SELECT user_key FROM user_table WHERE username = ?",
        (signup_request.username,)
    )
    rowList = cursor.fetchall()
    user_key = rowList[0][0]
    cursor.execute("INSERT INTO friend_table (friend_key, friend_name, user_key) VALUES (?, ?, ?)",
                   (user_key, signup_request.username, user_key))
    conn.commit()

    return {"message": "Signup successful"}

# /addfriend


class AddFriendRequest(BaseModel):
    friend_name: str
    user_key: int  # The key of the user who is adding the friend


def get_user_from_token(token: str):
    # Ensure the token is a string
    if not isinstance(token, str):
        return None

    try:
        return int(token, 16)  # Convert from hex to int as an example
    except ValueError:
        return None


def get_current_user_token(request: Request):
    return request.headers.get("Authorization")


def get_friend_key(friend_name: str):
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()

    # 사용자 정보 확인

    cursor.execute('''SELECT user_key FROM user_table WHERE username = ?''',
                   (friend_name,))
    user_key = cursor.fetchone()
    return user_key


@app.post("/addfriend")
async def add_friend(request: Request, add_friend_request: AddFriendRequest):

    user_key = request.headers.get("user_key")
    if not user_key:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # SQLite 데이터베이스에 연결
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()

    # Check if the friend_name exists in user_table
    cursor.execute("SELECT user_key FROM user_table WHERE username = ?",
                   (add_friend_request.friend_name,))
    friend_user_key = cursor.fetchone()[0]
    if not friend_user_key:
        return {"error": "Friend username does not exist"}

    # Check if the friend is already added
    cursor.execute("SELECT * FROM friend_table WHERE friend_name = ? AND user_key = ?",
                   (add_friend_request.friend_name, add_friend_request.user_key))
    if cursor.fetchone():
        return {"error": "Friend already added"}

    # Insert the new friend information
    cursor.execute("INSERT INTO friend_table (friend_key, friend_name, user_key) VALUES (?, ?, ?)",
                   (friend_user_key, add_friend_request.friend_name, add_friend_request.user_key))
    conn.commit()

    return {"message": "Friend added successfully"}

# Helper function to retrieve user from token


@app.get("/friends")
async def get_friends(user_key: int):
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()
    cursor.execute(
        "SELECT friend_key FROM friend_table WHERE user_key = ?", (user_key,))
    friends = cursor.fetchall()
    return {"friend_key": [friend[0] for friend in friends]}


@app.get("/friend-name")
async def friend_name(friend_key: int):
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()
    cursor.execute(
        "SELECT friend_name FROM friend_table WHERE friend_key = ?", (friend_key,))
    friend = cursor.fetchone()
    return {"friend_name": friend}


@app.get("/chat-rooms")
async def get_chat_rooms(user_key: int):
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()

    # Fetch chat rooms for the given user
    cursor.execute(
        "SELECT room_key, room_name FROM chat_room_personal_table WHERE user_key = ?", (user_key,))
    chat_rooms = cursor.fetchall()
    if not chat_rooms:
        return None
    return [{"room_key": room[0], "room_name": room[1]} for room in chat_rooms]


@app.get("/messages-all")
async def get_messages(room_key: int):
    conn = sqlite3.connect('kakao.db')
    c = conn.cursor()

    c.execute(
        """SELECT * FROM message_table 
        INNER JOIN user_table 
        ON message_table.user_key = user_table.user_key
        WHERE room_key = ?""", (room_key,)
    )
    # ['message_key', 'message', 'room_key', 'user_key', 'time_stamp', 'reply_key','message_type', 'content_path', 'user_key', 'username', 'password']
    #        0           1          2            3            4             5           6               7            8           9              10
    # [(2, 'hih', 2, 2, '2023-12-16 13:32:06', None, 0, None, 2, 't2', 't2'),
    # (3, 'asdfdafdsf', 2, 1, '2023-12-16 13:32:18', None, 0, None, 1, 't1', 't1'),
    # (4, 'ㅑㅑ', 2, 1, '2023-12-16 13:32:56', None, 0, None, 1, 't1', 't1')]
    messages = c.fetchall()
    # print(messages)
    if not messages:
        return None
    # if
    return [{'user_key': msg[3], 'username': msg[9], "message": msg[1], "time_stamp": msg[4], "reply_key": msg[5], "message_type": msg[6], "message_key": msg[0]} for msg in messages]


class CreatePersonalChatRoomRequest(BaseModel):
    user_key: int
    friend_key: int


@app.post("/create-or-get-personal-chat-room")
async def create_or_get_personal_chat_room(request: Request, chat_request: CreatePersonalChatRoomRequest):
    conn = sqlite3.connect('kakao.db')
    cursor = conn.cursor()

    # Check if a chat room between these two users already exists
    cursor.execute("""
        SELECT id, room_key, room_name FROM chat_room_personal_table
        WHERE (user_key = ? AND friend_key = ?) OR (user_key = ? AND friend_key = ?)""",
                   (chat_request.friend_key, chat_request.user_key, chat_request.user_key, chat_request.friend_key))
    room = cursor.fetchone()
    if room:
        return {"room_id": room[0], "room_key": room[1], "room_name": room[2]}

    # Create a new chat room if it doesn't exist
    cursor.execute("""
        INSERT INTO chat_room_personal_table (room_name, user_key, friend_key) 
        VALUES (
            (SELECT friend_name FROM friend_table WHERE friend_key = ?), 
            ?, 
            ?
        )""",
                   (chat_request.friend_key, chat_request.user_key, chat_request.friend_key))
    new_room_id = cursor.lastrowid
    new_room_key = new_room_id  # Setting room_key as the new row's id

    # Update the room_key in the chat_room_personal_table
    cursor.execute("UPDATE chat_room_personal_table SET room_key = ? WHERE id = ?",
                   (new_room_key, new_room_id))

    if chat_request.friend_key != chat_request.user_key:
        cursor.execute("INSERT INTO chat_room_personal_table (room_key, room_name, user_key, friend_key) VALUES (?, (SELECT friend_name FROM friend_table WHERE friend_key = ?), ?, ?)",
                       (new_room_key, chat_request.user_key, chat_request.friend_key, chat_request.user_key))

    conn.commit()

    cursor.execute("""
        SELECT id, room_key, room_name FROM chat_room_personal_table 
        WHERE (user_key = ? AND friend_key = ?) OR (user_key = ? AND friend_key = ?)""",
                   (chat_request.friend_key, chat_request.user_key, chat_request.user_key, chat_request.friend_key))
    room = cursor.fetchone()

    return {"room_id": room[0], "room_key": room[1], "room_name": room[2]}


@app.post("/insert-message")
async def insert_message(request: Request):
    body = await request.json()
    message = body.get('message')
    user_key = body.get('user_key')
    room_key = body.get('room_key')
    reply_key = body.get('reply_key')
    message_type = body.get('message_type')

    if not message or not user_key or not room_key:
        raise HTTPException(status_code=400, detail="Missing data")

    insert_message_text(
        message, user_key, room_key, reply_key, message_type)

    return {"detail": "Message inserted successfully"}


def insert_message_text(message: str, user_key: int, room_key: int, reply_key, message_type: int):
    # reply_key: null or message_key
    # Make sure to handle exceptions and errors appropriately
    with sqlite3.connect('kakao.db') as conn:
        c = conn.cursor()
        c.execute(
            '''INSERT INTO message_table (message, user_key, room_key, reply_key, message_type) VALUES (?, ?, ?, ?, ?)''',
            (message, user_key, room_key, reply_key, message_type)
        )
        conn.commit()


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "public/")
IMG_DIR = os.path.join(STATIC_DIR, "images/")
SERVER_IMG_DIR = os.path.join("http://localhost:8000/", "public/", "images/")
# print(STATIC_DIR)
# print(IMG_DIR)
# print(SERVER_IMG_DIR)


@app.post("/insert-image")
async def insert_message_image(user_key: int, room_key: int, message_type: int):
    content_path = 0
    with sqlite3.connect('kakao.db') as conn:
        c = conn.cursor()
        c.execute(
            '''INSERT INTO message_table (user_key, room_key, message_type, content_path) VALUES (?, ?, ?, ?)''',
            (user_key, room_key, message_type, content_path)
        )
        conn.commit()


@app.post("/upload-photo")
async def upload_photo(request: Request, in_files: List[UploadFile] = File(...)):
    file_urls = []
    for file in in_files:
        currentTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        saved_file_name = ''.join([currentTime, secrets.token_hex(16)])
        print(saved_file_name)
        file_location = os.path.join(IMG_DIR, saved_file_name)
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        file_urls.append(SERVER_IMG_DIR+saved_file_name)
    result = {'fileUrls': file_urls}

    body = await request.json()
    message = body.get('message')
    user_key = body.get('user_key')
    room_key = body.get('room_key')
    reply_key = body.get('reply_key')
    message_type = body.get('message_type')
    insert_message_text(
        message, user_key, room_key, reply_key, message_type)
