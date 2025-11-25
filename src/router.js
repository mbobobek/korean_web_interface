import { HomeScreen } from "./screens/HomeScreen.js";
import { BookScreen } from "./screens/BookScreen.js";
import { GwaScreen } from "./screens/GwaScreen.js";
import { IntroScreen } from "./screens/IntroScreen.js";
import { SessionScreen } from "./screens/SessionScreen.js";
import { FlashcardScreen } from "./screens/FlashcardScreen.js";
import { EndScreen } from "./screens/EndScreen.js";
import { MyDeckScreen } from "./screens/MyDeckScreen.js";
import { CreateDeckScreen } from "./screens/CreateDeckScreen.js";
import { TypeCheckTestScreen } from "./screens/TypeCheckTestScreen.js";
import { TestScreen } from "./screens/TestScreen.js";
import { LiveQuizMenu } from "./screens/LiveQuizMenu.js";
import { LiveHostScreen } from "./screens/LiveHostScreen.js";
import { LiveJoinScreen } from "./screens/LiveJoinScreen.js";
import { TutorScreen } from "./screens/TutorScreen.js";
import AiChatScreen from "./screens/AiChatScreen.js";
import LessonsScreen from "./screens/LessonsScreen.js";
import StudyScreen from "./screens/StudyScreen.js";

export const routes = {
  "/": HomeScreen,
  "/lessons": LessonsScreen,
  "/study": StudyScreen,
  "/tutor": TutorScreen,
  "/ai": AiChatScreen,
};

export function showHome(root, props) {
  root.innerHTML = "";
  root.appendChild(HomeScreen(props));
}

export function showGwa(root, props) {
  root.innerHTML = "";
  root.appendChild(GwaScreen(props));
}

export function showIntro(root, props) {
  root.innerHTML = "";
  root.appendChild(IntroScreen(props));
}

export function showSessions(root, props) {
  root.innerHTML = "";
  root.appendChild(SessionScreen(props));
}

export function showFlashcards(root, props) {
  root.innerHTML = "";
  root.appendChild(FlashcardScreen(props));
}

export function showEnd(root, props) {
  root.innerHTML = "";
  root.appendChild(EndScreen(props));
}

export function showMyDeck(root, props) {
  root.innerHTML = "";
  root.appendChild(MyDeckScreen(props));
}

export function showCreateDeck(root, props) {
  root.innerHTML = "";
  root.appendChild(CreateDeckScreen(props));
}

export function showTypeCheck(root, props) {
  root.innerHTML = "";
  root.appendChild(TypeCheckTestScreen(props));
}

export function showTest(root, props) {
  root.innerHTML = "";
  root.appendChild(TestScreen(props));
}

export function showLiveQuiz(root, props) {
  root.innerHTML = "";
  root.appendChild(LiveQuizMenu(props));
}

export function showLiveHost(root, props) {
  root.innerHTML = "";
  root.appendChild(LiveHostScreen(props));
}

export function showLiveJoin(root, props) {
  root.innerHTML = "";
  root.appendChild(LiveJoinScreen(props));
}

export function showBookSelect(root, props) {
  root.innerHTML = "";
  root.appendChild(BookScreen(props));
}

export function showTutor(root, props) {
  root.innerHTML = "";
  root.appendChild(TutorScreen(props));
}

export function showAi(root, props) {
  root.innerHTML = "";
  root.appendChild(AiChatScreen(props));
}

export function showLessons(root, props) {
  root.innerHTML = "";
  root.appendChild(LessonsScreen(props));
}

export function showStudy(root, props) {
  root.innerHTML = "";
  root.appendChild(StudyScreen(props));
}
