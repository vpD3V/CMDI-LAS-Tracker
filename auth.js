import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyBgehM22uCpXI5NDqd1vfvMMWnN4GZfOWY",
  authDomain: "las-tracking.firebaseapp.com",
  projectId: "las-tracking",
  storageBucket: "las-tracking.firebasestorage.app",
  messagingSenderId: "715146359357",
  appId: "1:715146359357:web:63346d7abf61c5444a3054"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- UI Elements ---
const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

// === Dynamic Section Filtering based on Grade Level ===
const regGradeLevel = document.getElementById("regGradeLevel");
const regSection = document.getElementById("regSection");

const sectionsByGrade = {
  "Grade 11": [
    "Simplicity",
    "Humility",
    "Stewardship",
    "Competence",
    "Family Spirit",
    "Excellence",
    "Integrity"
  ],
  "Grade 12": [
    "Indonesia",
    "Vietnam",
    "Myanmar",
    "Cambodia",
    "Philippines"
  ]
};

// Default: disable Section select
regSection.disabled = true;

regGradeLevel?.addEventListener("change", () => {
  const grade = regGradeLevel.value;

  // reset section dropdown
  regSection.innerHTML = `<option value="">-- Select Section --</option>`;
  regSection.disabled = true;

  if (sectionsByGrade[grade]) {
    sectionsByGrade[grade].forEach(sec => {
      regSection.innerHTML += `<option value="${sec}">${sec}</option>`;
    });
    regSection.disabled = false;   // enable sections once grade is chosen
    regGradeLevel.disabled = true; // lock grade level
    document.getElementById("resetGradeBtn").style.display = "inline-block";
  }
});

document.getElementById("resetGradeBtn").addEventListener("click", () => {
  regGradeLevel.value = "";
  regSection.innerHTML = `<option value="">-- Select Section --</option>`;
  regSection.disabled = true;
  regGradeLevel.disabled = false;
  document.getElementById("resetGradeBtn").style.display = "none";
});



// --- Reset Password ---
document.getElementById("forgotPasswordLink")?.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("userID").value.trim().toLowerCase();
  const msgBox = document.getElementById("resetMessage");

  if (!email) {
    msgBox.style.color = "red";
    msgBox.textContent = "⚠️ Please enter your email above first.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    msgBox.style.color = "lightgreen";
    msgBox.textContent = "✅ Password reset email sent! Please check your inbox.";
  } catch (err) {
    msgBox.style.color = "red";
    msgBox.textContent = "❌ " + err.message;
  }
});

// Switch to Register
document.getElementById("toRegister")?.addEventListener("click", (e) => {
  e.preventDefault();
  loginPage.style.display = "none";
  registerPage.style.display = "block";
  loginError.textContent = "";
});

// Back to Login
document.getElementById("backToLoginBtn")?.addEventListener("click", () => {
  registerPage.style.display = "none";
  loginPage.style.display = "block";
  registerError.textContent = "";
});

// --- Registration for Students ---
document.getElementById("createAccountBtn")?.addEventListener("click", async () => {
  showLoading();
  try {
    const name = document.getElementById("regName").value.trim();
    const id = document.getElementById("regID").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const pw = document.getElementById("regPassword").value;
    const section = document.getElementById("regSection")?.value || "";
    const gradeLevel = document.getElementById("regGradeLevel")?.value || "";

    if (!name || !id || !email || !pw || !section || !gradeLevel) {
      registerError.textContent = "⚠️ Please fill out all required fields.";
      return;
    }

    // Create LAS template: LAS1–LAS20 default = false
    const lasFields = {};
    for (let i = 1; i <= 20; i++) {
      lasFields[`LAS${i}`] = false;
    }

    let lasTemplate = {};

    // Depende sa section, mag-iiba ang subjects
    if (section === "Philippines") {
      [
        "Research in Daily Life 2",
        "Introduction to the Philosophy of Human Person",
        "Physical Science",
        "English for Academic and Professional Purpose",
        "Pagsulat ng Filipino sa Piling Larang",
        "21st Century Literature from the Philippines and the World",
        "Empowerment Technology",
        "Business Marketing",
        "Physical Education and Health",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    } 
    else if (section === "Indonesia") {
      [
        "Research in Daily Life 2",
        "Introduction to the Philosophy of Human Person",
        "Physical Science",
        "English for Academic and Professional Purpose",
        "Pagsulat ng Filipino sa Piling Larang",
        "Java IV: Object-Oriented Programming",
        "Oracle II: Database II",
        "21st Century Literature from the Philippines and the World",
        "Physical Education and Health",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    } 
    else if (section === "Cambodia") {
  [
    "Research in Daily Life 2",
        "Introduction to the Philosophy of Human Person",
        "Physical Science",
        "English for Academic and Professional Purpose",
        "Pagsulat ng Filipino sa Piling Larang",
        "Local Guiding 1",
        "Events Management Services 3",
        "21st Century Literature from the Philippines and the World",
        "Physical Education and Health",
  ].forEach(subj => {
    lasTemplate[subj] = { ...lasFields };
  });
}
    else if (section === "Myanmar") {
      [
        "Research in Daily Life 2",
        "Cookery 1",
        "Cookery 2",
        "Introduction to the Philosophy of Human Person",
        "Physical Science",
        "English for Academic and Professional Purpose",
        "Pagsulat ng Filipino sa Piling Larang",
        "Local Guiding 1",
        "Events Management Services 3",
        "21st Century Literature from the Philippines and the World",
        "Physical Education and Health",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }
    else if (section === "Vietnam") {
      [
        "Research in Daily Life 2",
        "Creative Writing",
        "Philippine Politics and Governance",
        "Introduction to the Philosophy of Human Person",
        "Physical Science",
        "English for Academic and Professional Purpose",
        "Pagsulat ng Filipino sa Piling Larang",
        "Phillipine Politics and Governance",
        "21st Century Literature from the Philippines and the World",
        "Physical Education and Health",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else if (section === "Simplicity") {
      [
        "Understanding Culture, Society and Politics", 
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Earth and Life Science",
        "Personality Development",
        "Oral Communication",
        "General Mathematics",
        "HouseKeeping 1",
        "Bread and Pastry Production 1",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else if (section === "Integrity") {
      [
        "Understanding Culture, Society and Politics", 
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Earth and Life Science",
        "Personality Development",
        "Oral Communication",
        "General Mathematics",
        "Introduction to World Religions and Belief Systems",
        "Discipline and Ideas in the Social Sciences",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else if (section === "Stewardship") {
      [
        "Understanding Culture, Society and Politics", 
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Earth and Life Science",
        "Personality Development",
        "Oral Communication",
        "General Mathematics",
        "Java I Logic Formulation",
        "Java II: Java Programming 1",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else if (section === "Humility") {
      [
        "Understanding Culture, Society and Politics", 
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Earth and Life Science",
        "Personality Development",
        "Oral Communication",
        "General Mathematics",
        "Front Office Services I",
        "Events Management Services I",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else if (section === "Competence") {
      [
        "Understanding Culture, Society and Politics", 
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Earth and Life Science",
        "Personality Development",
        "Oral Communication",
        "General Mathematics",
        "Business Mathematics",
        "FABM I",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else if (section === "Excellence") {
      [
        "Understanding Culture, Society and Politics", 
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Earth and Life Science",
        "Personality Development",
        "Oral Communication",
        "General Mathematics",
        "Introduction to World Religions and Belief Systems",
        "Discipline and Ideas in the Social Sciences",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else if (section === "Family Spirit") {
      [
        "Understanding Culture, Society and Politics", 
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Earth and Life Science",
        "Personality Development",
        "Oral Communication",
        "General Mathematics",
        "Introduction to World Religions and Belief Systems",
        "Discipline and Ideas in the Social Sciences",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    else {
      // Default subjects kung walang match na section
      [
        "Research in Daily Life 2",
        "Introduction to the Philosophy of Human Person",
        "Physical Science",
        "English for Academic and Professional Purpose",
        "Pagsulat ng Filipino sa Piling Larang",
        "21st Century Literature from the Philippines and the World",
        "Physical Education and Health",
      ].forEach(subj => {
        lasTemplate[subj] = { ...lasFields };
      });
    }

    // 1. Create Firebase Auth account
    const userCred = await createUserWithEmailAndPassword(auth, email, pw);
    const uid = userCred.user.uid;

    // 2. Save to Firestore in 'students' collection
    await setDoc(doc(db, "students", uid), {
      name,
      studentId: id,
      email,
      section,
      gradeLevel,
      subjects: lasTemplate
    });

    alert("✅ Account created! You can now login.");
    registerPage.style.display = "none";
    loginPage.style.display = "block";
  } catch (err) {
    registerError.textContent = "❌ Firebase error: " + err.message;
    console.error(err);
  } finally {
    hideLoading();
  }
});

// --- Login ---
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("userID").value.trim().toLowerCase();
  const pw = document.getElementById("password").value;

  if (!email || !pw) {
    loginError.textContent = "⚠️ Fill out both fields.";
    return;
  }

  showLoading();
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pw);
    const uid = cred.user.uid;

    // ✅ Check teacher record by UID
    const teacherDoc = await getDoc(doc(db, "teachers", uid));
    const isTeacher = teacherDoc.exists();

    if (isTeacher) {
      const teacherData = teacherDoc.data();
      sessionStorage.setItem("teacher_subjects", JSON.stringify(teacherData.subjects || {}));
      sessionStorage.setItem("teacher_name", teacherData.name || "");
    } else {
      sessionStorage.setItem("student_uid", uid);
    }

    sessionStorage.setItem("las_role", isTeacher ? "teacher" : "student");
    sessionStorage.setItem("las_user_email", email);

    window.location.href = "dashboard.html";
  } catch (err) {
    loginError.textContent = "Login failed: " + err.message;
    console.error(err);
  } finally {
    hideLoading();
  }
});

// --- Logout Function ---
export async function logout() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn("SignOut error:", e);
  }
  sessionStorage.clear();
  window.location.href = "index.html";
}

// --- Redirect Control ---
onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split("/").pop();
  if (!user && currentPage === "dashboard.html") {
    window.location.href = "index.html";
  }
});

// --- Loading Helpers ---
function showLoading() {
  document.getElementById("loadingScreen").style.display = "flex";
}
function hideLoading() {
  document.getElementById("loadingScreen").style.display = "none";

}
