import React, { useState, useEffect, useCallback, useRef } from "react";
import { minionDictionary, dictionaryKeys } from "../data/dictionary";
import { speakBrowserTts } from "../utils/localLogic";
import { shuffleArray, animateBanana } from "../utils/helpers";

// Constanten
const QUIZ_STATE = {
  START: "START",
  GAME: "GAME",
  END: "END",
};

export default function Quiz({
  useApi,
  addBananas,
  setQuizInProgress,
  totalQuestions,
  bonus,
  onCorrectAnswer,
  userName,
}) {
  const [quizState, setQuizState] = useState(QUIZ_STATE.START);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const [bobCheatUsed, setBobCheatUsed] = useState(false);
  const [bobTip, setBobTip] = useState(null);

  const [rouletteState, setRouletteState] = useState("none");
  const [rouletteDiff, setRouletteDiff] = useState(0);
 
  const [bananaBlast, setBananaBlast] = useState(false);
  const [blastCoords, setBlastCoords] = useState({ x: 0, y: 0 });

  const answerButtonRefs = useRef([]);

  const loadNextQuestion = useCallback(() => {
    if (questionsAnswered >= totalQuestions) {
      setQuizState(QUIZ_STATE.END);
      setQuizInProgress(false);
      return;
    }

    setFeedback(null);
    setIsAnswered(false);
    setSelectedAnswerIndex(null);
    answerButtonRefs.current = [];
    setBananaBlast(false);
    setBobCheatUsed(false);
    setBobTip(null);

    const correctIndex = Math.floor(Math.random() * dictionaryKeys.length);
    const correctAnswerEng = dictionaryKeys[correctIndex];
    const correctAnswerMin = minionDictionary[correctAnswerEng];
    setCurrentQuestion({ eng: correctAnswerEng, min: correctAnswerMin });

    let wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const wrongIndex = Math.floor(Math.random() * dictionaryKeys.length);
      if (wrongIndex !== correctIndex) {
        const wrongAnswerMin = minionDictionary[dictionaryKeys[wrongIndex]];
        if (!wrongAnswers.includes(wrongAnswerMin)) {
          wrongAnswers.push(wrongAnswerMin);
        }
      }
    }

    setAnswers(shuffleArray([...wrongAnswers, correctAnswerMin]));
  }, [questionsAnswered, totalQuestions, setQuizInProgress]);

  const useBobCheat = () => {
    if (bobCheatUsed || isAnswered) return;
    setBobCheatUsed(true);
    const correctAns = currentQuestion.min;
    const isCorrect = Math.random() < 0.6;
    if (isCorrect) {
      setBobTip(correctAns);
    } else {
      const wrong = answers.filter((a) => a !== correctAns);
      const chosenWrong = wrong.length > 0 ? wrong[Math.floor(Math.random() * wrong.length)] : "BANANA!";
      setBobTip(Math.random() < 0.5 ? chosenWrong : "BANANA! 🍌");
    }
  };

  const playRoulette = () => {
    if (rouletteState !== "none") return;
    setRouletteState("spinning");
    const isPerfect = score === totalQuestions;
    const totalWinnings = score + (isPerfect ? bonus : 0);
    setRouletteDiff(totalWinnings);

    setTimeout(() => {
      const win = Math.random() < 0.5;
      if (win) {
        setRouletteState("won");
        addBananas(totalWinnings);
      } else {
        setRouletteState("lost");
        addBananas(-totalWinnings);
      }
    }, 2000);
  };

  const startQuiz = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setQuizState(QUIZ_STATE.GAME);
    setQuizInProgress(true);
    setRouletteState("none");
    setRouletteDiff(0);
    loadNextQuestion();
  };

  const resetQuiz = () => {
    setQuizState(QUIZ_STATE.START);
    setRouletteState("none");
    setRouletteDiff(0);
  };

  const handleAnswerClick = (selectedAnswer, buttonIndex, event) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswerIndex(buttonIndex);

    const buttonElement = answerButtonRefs.current[buttonIndex];

    if (selectedAnswer === currentQuestion.min) {
      setFeedback({ type: "correct", text: "Bello! Correct!" });
      setScore((prev) => prev + 1);
      addBananas(1);

      animateBanana(buttonElement);

      const rect = buttonElement.getBoundingClientRect();
      setBlastCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setBananaBlast(true);

      if (onCorrectAnswer) onCorrectAnswer();
    } else {
      setFeedback({
        type: "wrong",
        text: `Bi-do! Fout. Het was ${currentQuestion.min}`,
      });
    }

    setTimeout(() => {
      setQuestionsAnswered((prev) => prev + 1);
      loadNextQuestion();
    }, 2000);
  };

  const handleTtsClick = () => {
    if (!currentQuestion || isTtsLoading) return;
    setIsTtsLoading(true);
    speakBrowserTts(currentQuestion.eng);
    setIsTtsLoading(false);
  };

  useEffect(() => {
    return () => {
      setQuizInProgress(false);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [setQuizInProgress]);

  // --- Render Functies ---

  const renderStartScreen = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🎮</div>
      <h2 className="text-3xl font-black text-blue-900 mb-4 uppercase tracking-wider">
        Quiz Time!
      </h2>
      <p className="text-gray-600 mb-2 text-lg">
        Beantwoord {totalQuestions} vragen.
      </p>
      <p className="text-yellow-600 font-bold mb-8 text-xl">
        1 Banaan per goed antwoord!
      </p>

      <button
        onClick={startQuiz}
        className="px-10 py-5 bg-green-500 text-white text-2xl font-black rounded-2xl shadow-[0_8px_0_rgb(21,128,61)] hover:bg-green-400 hover:shadow-[0_6px_0_rgb(21,128,61)] hover:translate-y-1 active:shadow-none active:translate-y-3 transition-all"
      >
        START GAME
      </button>
    </div>
  );

  const renderGameScreen = () => (
    <div className="w-full">
      {/* Scoreboard Header */}
      <div className="flex justify-between items-center mb-6 bg-blue-800 p-3 rounded-xl border-2 border-blue-700/50">
        <div className="flex flex-col items-start">
          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">
            Vraag
          </span>
          <span className="text-white font-black text-xl">
            {Math.min(questionsAnswered + 1, totalQuestions)}
            <span className="text-blue-400 text-sm">/{totalQuestions}</span>
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider">
            Score
          </span>
          <span className="text-white font-black text-xl">{score} 🍌</span>
        </div>
      </div>

      {/* Vraag Sectie */}
      <div className="mb-6 text-center">
        <p className="text-blue-400 font-bold mb-2 uppercase text-sm tracking-wide">
          Vertaal dit:
        </p>
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-3 drop-shadow-sm">
            {currentQuestion?.eng}
          </h2>
          <button
            onClick={handleTtsClick}
            disabled={isTtsLoading}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 flex items-center justify-center transition disabled:opacity-50"
            title="Luister"
          >
            {isTtsLoading ? (
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>🔊</span>
            )}
          </button>
        </div>

        {/* Bob-Cheat Knop */}
        <div className="mt-4 flex flex-col items-center justify-center min-h-[48px]">
          {!bobCheatUsed ? (
            <button
              onClick={useBobCheat}
              disabled={isAnswered}
              className="px-4 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-full text-amber-800 font-black text-xs flex items-center gap-1.5 shadow-sm active:translate-y-0.5 transition"
            >
              <span>🧸</span>
              <span>Vraag Bob om hulp</span>
            </button>
          ) : (
            bobTip && (
              <div className="bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200 px-4 py-2 rounded-2xl relative animate-fade-in flex items-center gap-2">
                <span>💬 Bob fluistert:</span>
                <span className="italic font-extrabold text-blue-700">"{bobTip}"</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Antwoorden Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {answers.map((answer, index) => {
          // BASIS STIJL: Dikke 3D knop
          let btnClass =
            "w-full p-4 text-lg font-bold rounded-xl transition-all duration-150 border-2 relative top-0 ";
          let shadowClass =
            " shadow-[0_6px_0_rgb(0,0,0,0.1)] active:shadow-none active:top-[6px] "; // Standaard schaduw en druk-effect

          if (isAnswered) {
            // GEEN HOVER/ACTIVE MEER NA ANTWOORDEN
            shadowClass = " shadow-none top-[6px] cursor-default ";

            if (answer === currentQuestion.min) {
              // JUISTE ANTWOORD (Groen)
              btnClass += " bg-green-500 border-green-600 text-white";
            } else if (index === selectedAnswerIndex) {
              // FOUT GEKLIKT ANTWOORD (Rood)
              btnClass += " bg-red-500 border-red-600 text-white";
            } else {
              // ANDERE FOUTE ANTWOORDEN (Grijs)
              btnClass +=
                " bg-gray-200 border-gray-300 text-gray-400 opacity-50";
            }
          } else {
            // NOG NIET BEANTWOORD (Geel/Standaard)
            btnClass +=
              " bg-yellow-400 border-yellow-500 text-blue-900 hover:bg-yellow-300";
            // Voeg standaard schaduw toe
            btnClass +=
              " shadow-[0_6px_0_rgb(202,138,4)] active:shadow-none active:top-[6px]";
          }

          return (
            <button
              key={index}
              ref={(el) => (answerButtonRefs.current[index] = el)}
              className={btnClass} // We gebruiken de gecombineerde classes niet direct om conflicten te voorkomen, maar bouwen ze hierboven op
              onClick={(e) => handleAnswerClick(answer, index, e)}
              disabled={isAnswered}
            >
              {answer}
            </button>
          );
        })}
      </div>

      {/* Feedback Balk */}
      <div className="h-12 flex items-center justify-center">
        {feedback && (
          <div
            className={`px-6 py-2 rounded-full font-black text-lg animate-bounce ${
              feedback.type === "correct"
                ? "bg-green-100 text-green-700 border-2 border-green-200"
                : "bg-red-100 text-red-700 border-2 border-red-200"
            }`}
          >
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );

  const [bonusAdded, setBonusAdded] = useState(false);
  useEffect(() => {
    if (
      quizState === QUIZ_STATE.END &&
      score === totalQuestions &&
      !bonusAdded
    ) {
      addBananas(bonus);
      setBonusAdded(true);
    }
    if (quizState === QUIZ_STATE.START) {
      setBonusAdded(false);
    }
  }, [quizState, score, totalQuestions, bonus, addBananas, bonusAdded]);

  const renderEndScreen = () => {
    const isPerfect = score === totalQuestions;
    const bonusText = isPerfect ? ` + ${bonus} BONUS!` : "";
    const totalWinnings = score + (isPerfect ? bonus : 0);

    return (
      <div id="quiz-end-screen" className="text-center py-6 w-full max-w-md mx-auto">
        <div className="text-6xl mb-4">
          {rouletteState === "won" ? "🎉🎰🏆" : rouletteState === "lost" ? "😭📉💥" : isPerfect ? "🏆" : "🍌"}
        </div>
        
        {rouletteState === "none" && (
          <>
            <h2 className="text-3xl font-black text-blue-900 mb-2">Quiz Voltooid!</h2>
            <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Jouw Score</p>
              <p className="text-4xl font-black text-blue-600 mb-2">
                {score} <span className="text-xl text-gray-400">/ {totalQuestions}</span>
              </p>
              <p className="text-lg font-bold text-yellow-600">
                +{totalWinnings} Bananen verdiend!
              </p>
            </div>

            {/* Roulette Panel */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 mb-6 text-center">
              <h4 className="font-black text-purple-900 text-sm uppercase tracking-wider mb-1">Bananen Roulette 🎰</h4>
              <p className="text-xs text-purple-600 mb-3">
                Gok met je winst! 50% kans om te <strong>verdubbelen (+{totalWinnings} 🍌)</strong> of <strong>alles te verliezen (-{totalWinnings} 🍌)</strong>.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={playRoulette}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-[0_4px_0_rgb(109,40,217)] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  🎰 DRAAI ROULETTE
                </button>
                <button
                  onClick={resetQuiz}
                  className="py-2.5 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-black text-xs rounded-xl transition"
                >
                  Incasseer winst
                </button>
              </div>
            </div>
          </>
        )}

        {rouletteState === "spinning" && (
          <div className="py-12">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-black text-purple-900 animate-pulse">Roulette wiel spint... 🎰</h3>
            <p className="text-xs text-gray-400 mt-1">Bananen worden geschud...</p>
          </div>
        )}

        {rouletteState === "won" && (
          <div className="py-6">
            <h2 className="text-3xl font-black text-green-600 mb-2">JE HEBT GEWONNEN!</h2>
            <p className="text-base text-gray-600 mb-6 font-medium">
              Bobo is gul vandaag! Je hebt je winst verdubbeld: <br />
              <strong className="text-2xl text-yellow-600 font-black">+{rouletteDiff * 2} 🍌 totaal!</strong>
            </p>
            <button
              onClick={resetQuiz}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow"
            >
              Opnieuw Spelen 🔄
            </button>
          </div>
        )}

        {rouletteState === "lost" && (
          <div className="py-6">
            <h2 className="text-3xl font-black text-red-600 mb-2">ALLES KWIJT...</h2>
            <p className="text-base text-gray-600 mb-6 font-medium">
              Helaas! De Roulette-banaan gleed weg. Je hebt al je quiz-winst van deze ronde verloren (0 🍌).
            </p>
            <button
              onClick={resetQuiz}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow"
            >
              Opnieuw Spelen 🔄
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page max-w-3xl mx-auto">
      {/* De Grote Console Behuizing */}
      <div className="bg-blue-600 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border-b-[16px] border-blue-800 relative overflow-hidden">
        {/* Decoratieve schroeven */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-blue-800 rounded-full shadow-inner"></div>
        <div className="absolute top-6 right-6 w-4 h-4 bg-blue-800 rounded-full shadow-inner"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 bg-blue-800 rounded-full shadow-inner"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 bg-blue-800 rounded-full shadow-inner"></div>

        {/* Het 'Scherm' binnenin */}
        <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-inner border-4 border-blue-300 min-h-[400px] flex items-center justify-center relative z-10">
          {quizState === QUIZ_STATE.START && renderStartScreen()}
          {quizState === QUIZ_STATE.GAME && renderGameScreen()}
          {quizState === QUIZ_STATE.END && renderEndScreen()}
        </div>

        {/* Logo onderaan */}
        <div className="text-center mt-6 opacity-40">
          <span className="text-blue-200 font-black tracking-[0.5em] text-xs">
            MINION GAME BOY
          </span>
        </div>
      </div>

      {/* Bananen Explosie Container */}
      {bananaBlast && (
        <div
          style={{
            position: "fixed",
            left: blastCoords.x,
            top: blastCoords.y,
            width: 0,
            height: 0,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {Array.from({ length: 30 }).map((_, i) => {
            const randomX = (Math.random() - 0.5) * 300;
            const randomY = (Math.random() - 0.8) * 300;
            const randomRot = (Math.random() - 0.5) * 720;
            return (
              <span
                key={i}
                className="animate-banana-pop absolute"
                style={{
                  "--tx": `${randomX}px`,
                  "--ty": `${randomY}px`,
                  "--rot": `${randomRot}deg`,
                  fontSize: `${1 + Math.random()}rem`,
                }}
              >
                🍌
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
