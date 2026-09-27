from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta
import os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "change_this_secret_key")
app.permanent_session_lifetime = timedelta(days=30)

if os.environ.get("VERCEL"):
    DB_NAME = "/tmp/school.db"
    UPLOAD_FOLDER = "/tmp/uploads"
else:
    DB_NAME = "school.db"
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ---------- DATABASE SETUP ----------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            father_name TEXT NOT NULL,
            class_applying TEXT NOT NULL,
            past_school TEXT,
            certificate_filename TEXT,
            phone TEXT,
            address TEXT,
            submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


init_db()


# ---------- PUBLIC PAGES ----------
@app.route("/")
def home():
    return render_template("home.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/academics")
def academics():
    return render_template("academics.html")


@app.route("/admission", methods=["GET", "POST"])
def admission():
    if request.method == "POST":
        student_name = request.form.get("student_name")
        father_name = request.form.get("father_name")
        class_applying = request.form.get("class_applying")
        past_school = request.form.get("past_school")
        phone = request.form.get("phone")
        address = request.form.get("address")

        if not student_name or not father_name or not class_applying:
            flash("Please fill in the required fields: Student Name, Father's Name, and Class.")
            return redirect(url_for("admission"))

        certificate_filename = None
        certificate_file = request.files.get("certificate")
        if certificate_file and certificate_file.filename:
            certificate_filename = secure_filename(certificate_file.filename)
            try:
                certificate_file.save(os.path.join(UPLOAD_FOLDER, certificate_filename))
            except OSError:
                certificate_filename = None

        conn = get_db_connection()
        conn.execute(
            """INSERT INTO admissions
               (student_name, father_name, class_applying, past_school, certificate_filename, phone, address)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (student_name, father_name, class_applying, past_school, certificate_filename, phone, address),
        )
        conn.commit()
        conn.close()

        flash("Thank you! Your admission form has been received. We will contact you soon.")
        return redirect(url_for("admission"))

    return render_template("admission.html")


@app.route("/gallery")
def gallery():
    return render_template("gallery.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        flash(f"Thanks {name}! Your message has been received.")
        return redirect(url_for("contact"))
    return render_template("contact.html")


# ---------- SIGNUP ----------
@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        if not name or not email or not password:
            flash("Please fill in all fields.")
            return redirect(url_for("signup"))

        hashed_password = generate_password_hash(password)

        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                (name, email, hashed_password),
            )
            conn.commit()
        except sqlite3.IntegrityError:
            flash("An account with this email already exists.")
            conn.close()
            return redirect(url_for("signup"))
        conn.close()

        flash("Account created successfully! Please log in.")
        return redirect(url_for("login"))

    return render_template("signup.html")


# ---------- LOGIN ----------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        remember = request.form.get("remember")

        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()
        conn.close()

        if user and check_password_hash(user["password"], password):
            session.permanent = bool(remember)
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            flash(f"Welcome back, {user['name']}!")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password.")
            return redirect(url_for("login"))

    return render_template("login.html")


# ---------- FORGOT PASSWORD ----------
@app.route("/forgot-password")
def forgot_password():
    return render_template("forgot_password.html")


# ---------- LOGOUT ----------
@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.")
    return redirect(url_for("home"))


# ---------- DASHBOARD ----------
@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        flash("Please log in to view this page.")
        return redirect(url_for("login"))
    return render_template("dashboard.html", name=session.get("user_name"))


if __name__ == "__main__":
    app.run(debug=True)
