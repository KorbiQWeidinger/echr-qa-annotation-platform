import { useLogin } from "./contexts/login";
import { LoginForm } from "./components/login-form";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { AnnotationProvider } from "./contexts/annotation";
import { AnnotationForm } from "./components/annotation-form";
import { AnswerDisplay } from "./components/answer-display";

function App() {
  const { token } = useLogin();

  if (!token) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <LoginForm />
      </div>
    );
  }

  return (
    <AnnotationProvider>
      <div className="flex flex-col max-h-screen min-h-screen">
        <Header />
        <div className="flex flex-grow items-center justify-start">
          <div className="flex-1 mx-20 min-w-0">
            <AnswerDisplay />
          </div>
          <div className="grow min-w-[600px] max-w-[600px]">
            <AnnotationForm />
          </div>
        </div>
        <Footer />
      </div>
    </AnnotationProvider>
  );
}

export default App;
