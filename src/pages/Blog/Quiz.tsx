import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, SEO } from '@/components/shared'
import '../../styles/quiz.css'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual tecla ativa o modo de rotação no editor?',
    options: ['Q', 'W', 'E', 'R'],
    correct: 2,
    explanation: 'A tecla E ativa o modo de rotação. Q é seleção, W é mover e R é escalar.',
  },
  {
    id: 2,
    question: 'Qual componente permite criar portais entre mapas?',
    options: ['Teleporter', 'Portal', 'Gateway', 'Warp'],
    correct: 1,
    explanation: 'O componente Portal permite conectar diferentes áreas e mapas no seu jogo.',
  },
  {
    id: 3,
    question: 'Quantos tipos de comportamento de IA estão disponíveis para NPCs?',
    options: ['3', '5', '7', '4'],
    correct: 3,
    explanation: 'São 4 tipos: Idle (parado), Patrol (patrulha), Follow (seguir) e Aggressive (agressivo).',
  },
  {
    id: 4,
    question: 'Qual formato de arquivo 3D é aceito para importar modelos?',
    options: ['FBX', 'OBJ', 'GLB/GLTF', 'Todos acima'],
    correct: 2,
    explanation: 'O MMORPG Builder aceita formato GLB/GLTF com tamanho máximo de 10MB.',
  },
  {
    id: 5,
    question: 'Qual a diferença entre Collider e Trigger?',
    options: [
      'Não há diferença',
      'Collider bloqueia, Trigger detecta passagem',
      'Trigger bloqueia, Collider detecta',
      'Ambos bloqueiam movimento',
    ],
    correct: 1,
    explanation: 'Collider bloqueia a passagem física, enquanto Trigger apenas detecta quando algo passa por ele.',
  },
  {
    id: 6,
    question: 'A cada quantos segundos o auto-save salva o projeto?',
    options: ['10 segundos', '30 segundos', '60 segundos', '5 minutos'],
    correct: 1,
    explanation: 'O auto-save salva automaticamente a cada 30 segundos quando há alterações.',
  },
  {
    id: 7,
    question: 'Qual tipo de NPC é responsável por dar missões?',
    options: ['Merchant', 'Quest Giver', 'Trainer', 'Guard'],
    correct: 1,
    explanation: 'O Quest Giver é o tipo de NPC especializado em dar e gerenciar missões.',
  },
  {
    id: 8,
    question: 'Quantos slots iniciais tem o sistema de banco?',
    options: ['10', '20', '30', '50'],
    correct: 2,
    explanation: 'O banco começa com 30 slots, podendo ser expandido até 100 slots.',
  },
  {
    id: 9,
    question: 'Qual tecla abre o menu de interação com NPCs?',
    options: ['F', 'E', 'Space', 'Enter'],
    correct: 1,
    explanation: 'A tecla E é usada para interagir com NPCs e objetos no mundo do jogo.',
  },
  {
    id: 10,
    question: 'Onde o jogo é hospedado após o deploy?',
    options: ['AWS', 'Vercel', 'Heroku', 'DigitalOcean'],
    correct: 1,
    explanation: 'O MMORPG Builder usa a Vercel para hospedagem gratuita com domínio .vercel.app.',
  },
]

type QuizLevel = 'Iniciante' | 'Intermediário' | 'Expert'

function getLevel(score: number, total: number): QuizLevel {
  const percentage = (score / total) * 100
  if (percentage >= 80) return 'Expert'
  if (percentage >= 50) return 'Intermediário'
  return 'Iniciante'
}

function getLevelColor(level: QuizLevel): string {
  switch (level) {
    case 'Expert':
      return '#22c55e'
    case 'Intermediário':
      return '#f59e0b'
    default:
      return '#ef4444'
  }
}

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])

  const question = QUIZ_QUESTIONS[currentQuestion]
  const totalQuestions = QUIZ_QUESTIONS.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }

  const handleConfirm = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === question.correct
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    setAnswers((prev) => [...prev, isCorrect])
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  const handleShare = () => {
    const level = getLevel(score, totalQuestions)
    const text = `Fiz o Quiz do MMORPG Builder e acertei ${score}/${totalQuestions} - Nível: ${level}! Teste seus conhecimentos também:`
    const url = 'https://mmorpg-builder.vercel.app/blog/quiz'

    if (navigator.share) {
      navigator.share({
        title: 'Quiz MMORPG Builder',
        text,
        url,
      })
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank'
      )
    }
  }

  if (finished) {
    const level = getLevel(score, totalQuestions)
    const levelColor = getLevelColor(level)

    return (
      <div className="quiz-page">
        <SEO
          title="Quiz - Resultado | MMORPG Builder"
          description={`Você é nível ${level} no MMORPG Builder! Teste seus conhecimentos sobre criação de jogos.`}
        />
        <Navbar />
        <main className="quiz-main">
          <div className="quiz-result">
            <div className="quiz-result-icon">
              {level === 'Expert' ? '🏆' : level === 'Intermediário' ? '⭐' : '📚'}
            </div>
            <h1>Quiz Completo!</h1>
            <div className="quiz-result-score">
              <span className="quiz-result-number">{score}</span>
              <span className="quiz-result-total">/{totalQuestions}</span>
            </div>
            <div className="quiz-result-level" style={{ color: levelColor }}>
              Nível: {level}
            </div>
            <p className="quiz-result-message">
              {level === 'Expert' && 'Parabéns! Você domina o MMORPG Builder!'}
              {level === 'Intermediário' && 'Bom trabalho! Continue praticando para se tornar um expert!'}
              {level === 'Iniciante' && 'Continue aprendendo! Leia nossos tutoriais para melhorar.'}
            </p>

            <div className="quiz-result-summary">
              <h3>Resumo das Respostas</h3>
              <div className="quiz-result-answers">
                {answers.map((correct, index) => (
                  <div
                    key={index}
                    className={`quiz-result-answer ${correct ? 'correct' : 'wrong'}`}
                    title={`Pergunta ${index + 1}: ${correct ? 'Correta' : 'Errada'}`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="quiz-result-actions">
              <button className="quiz-btn quiz-btn-primary" onClick={handleShare}>
                Compartilhar Resultado
              </button>
              <button className="quiz-btn quiz-btn-secondary" onClick={handleRestart}>
                Tentar Novamente
              </button>
              <Link to="/blog" className="quiz-btn quiz-btn-outline">
                Voltar ao Blog
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="quiz-page">
      <SEO
        title="Quiz - Conhecimento do Editor | MMORPG Builder"
        description="Teste seus conhecimentos sobre o MMORPG Builder com nosso quiz interativo de 10 perguntas."
      />
      <Navbar />
      <main className="quiz-main">
        <div className="quiz-container">
          <div className="quiz-header">
            <Link to="/blog" className="quiz-back">
              ← Voltar
            </Link>
            <div className="quiz-progress-info">
              <span>
                Pergunta {currentQuestion + 1} de {totalQuestions}
              </span>
              <span className="quiz-score">Pontos: {score}</span>
            </div>
          </div>

          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="quiz-question-card">
            <h2 className="quiz-question">{question.question}</h2>

            <div className="quiz-options">
              {question.options.map((option, index) => {
                let optionClass = 'quiz-option'
                if (showExplanation) {
                  if (index === question.correct) {
                    optionClass += ' correct'
                  } else if (index === selectedAnswer && index !== question.correct) {
                    optionClass += ' wrong'
                  }
                } else if (index === selectedAnswer) {
                  optionClass += ' selected'
                }

                return (
                  <button
                    key={index}
                    className={optionClass}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showExplanation}
                  >
                    <span className="quiz-option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="quiz-option-text">{option}</span>
                  </button>
                )
              })}
            </div>

            {showExplanation && (
              <div className="quiz-explanation">
                <div className="quiz-explanation-icon">
                  {selectedAnswer === question.correct ? '✓' : '✗'}
                </div>
                <p>{question.explanation}</p>
              </div>
            )}

            <div className="quiz-actions">
              {!showExplanation ? (
                <button
                  className="quiz-btn quiz-btn-primary"
                  onClick={handleConfirm}
                  disabled={selectedAnswer === null}
                >
                  Confirmar Resposta
                </button>
              ) : (
                <button className="quiz-btn quiz-btn-primary" onClick={handleNext}>
                  {currentQuestion < totalQuestions - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
