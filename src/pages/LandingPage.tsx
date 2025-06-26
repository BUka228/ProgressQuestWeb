import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Target, Trophy, Users, Star, ChevronDown, Play, Pause, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [timerTime, setTimerTime] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isMonthly, setIsMonthly] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate('/app');
    }
  }, [currentUser, navigate]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime(time => time - 1);
      }, 1000);
    } else if (timerTime === 0) {
      setIsTimerRunning(false);
      toast.success('🎉 Pomodoro завершен! +25 XP');
      setTimerTime(25 * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerTime]);

  const startTimer = () => {
    if (!taskName.trim()) {
      toast.error('Введите название задачи');
      return;
    }
    setIsTimerRunning(true);
    toast.success('Таймер запущен! Удачи! 🍅');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: 'Могу ли я использовать приложение бесплатно?',
      answer: 'Да! ProgressQuest предлагает полнофункциональный бесплатный план "Искатель" с неограниченными личными задачами, Pomodoro-таймером и базовой геймификацией.'
    },
    {
      question: 'Чем это отличается от других таск-менеджеров?',
      answer: 'ProgressQuest объединяет продуктивность с игровыми элементами. У вас есть виртуальный сад, система уровней, достижения и челленджи, которые мотивируют выполнять задачи.'
    },
    {
      question: 'На каких платформах доступен ProgressQuest?',
      answer: 'ProgressQuest работает в любом современном браузере и имеет адаптивный дизайн для смартфонов и планшетов. Мобильные приложения находятся в разработке.'
    },
    {
      question: 'Как работает командная геймификация?',
      answer: 'В командном режиме вы можете создавать общие проекты, распределять задачи, участвовать в групповых челленджах и отслеживать коллективную статистику продуктивности.'
    },
    {
      question: 'Безопасны ли мои данные?',
      answer: 'Да, мы используем Firebase для безопасного хранения данных с шифрованием и соблюдаем все стандарты защиты персональной информации.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Panel */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <span className="text-2xl font-bold text-indigo-600">ProgressQuest</span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Возможности
              </a>
              <a href="#audience" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Для кого
              </a>
              <a href="#pricing" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Тарифы
              </a>
              <a href="#faq" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">
                Блог
              </a>
            </nav>
            <div className="flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-gray-500 hover:text-gray-900"
              >
                Войти
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Начать бесплатно
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Преврати свои цели в</span>
              <span className="block text-indigo-600">захватывающий квест</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Объедините мощь Pomodoro-таймера с увлекательной геймификацией. Достигайте большего, 
              получая удовольствие от процесса — в одиночку или в команде.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  🚀 Начать свой квест (бесплатно)
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Бесплатно навсегда. Не требуется кредитная карта.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-400/20 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-cyan-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-purple-400/20 rounded-full animate-ping"></div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="audience" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Для индивидуальных героев и легендарных команд
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Personal Productivity */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Для Личной Продуктивности</h3>
                <p className="text-lg text-gray-600 mt-2">Покоряйте свои цели в одиночку</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">Знакомые проблемы:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">❌</span>
                      <span className="text-gray-700">Вечно откладываете важные дела?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">❌</span>
                      <span className="text-gray-700">Сложно сфокусироваться на одной задаче?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">❌</span>
                      <span className="text-gray-700">Теряете мотивацию на полпути?</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Наши решения:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Pomodoro-таймер превратит марафон в серию коротких спринтов</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Система уровней и наград превратит рутину в увлекательную игру</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Виртуальный сад будет расти вместе с вашей продуктивностью</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Для Командной Работы</h3>
                <p className="text-lg text-gray-600 mt-2">Достигайте великих целей вместе</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">Командные вызовы:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">❌</span>
                      <span className="text-gray-700">Непрозрачный статус задач в проекте?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">❌</span>
                      <span className="text-gray-700">Низкая вовлеченность команды?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">❌</span>
                      <span className="text-gray-700">Сложно отследить общий прогресс?</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">Эффективные решения:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Общие рабочие пространства с Kanban-досками для полной прозрачности</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Командные челленджи и статистика для повышения азарта и сплоченности</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Гибкие роли и права доступа для структурированной работы</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Возможности
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Детальное описание ключевых функций продукта
            </p>
          </div>

          {/* Smart Task Management */}
          <div className="mb-20">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Умное Управление Задачами
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Создавайте задачи, разбивайте их на подзадачи, устанавливайте приоритеты и сроки. 
                  Визуализируйте свой рабочий процесс с помощью списков или Kanban-досок. 
                  Гибкие подходы (GTD, Матрица Эйзенхауэра) помогут адаптировать систему под себя.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <Target className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">GTD и Матрица Эйзенхауэра</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Гибкие подходы помогут адаптировать систему под себя.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-green-800">Завершить презентацию</span>
                    </div>
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <Clock className="h-5 w-5 text-yellow-400 mr-3" />
                      <span className="text-yellow-800">Подготовить отчет (до 18:00)</span>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <Plus className="h-5 w-5 text-blue-400 mr-3" />
                      <span className="text-blue-800">Планирование спринта</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="mb-20">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Pomodoro-таймер нового поколения
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Просто оцените время на задачу, и ProgressQuest сам составит план работы и отдыха. 
                  Наш Pomodoro-таймер поможет вам оставаться в потоке и избегать выгорания, 
                  работая в фоне на всех ваших устройствах.
                </p>
              </div>
              <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="text-center">
                    <div className="mx-auto w-32 h-32 rounded-full border-8 border-gray-200 relative">
                      <div className="absolute inset-0 rounded-full border-8 border-indigo-500" style={{clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)'}}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">{formatTime(timerTime)}</span>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3">
                      <input
                        type="text"
                        placeholder="Название вашей задачи..."
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button
                        onClick={startTimer}
                        disabled={isTimerRunning}
                        className={`w-full ${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                      >
                        {isTimerRunning ? (
                          <><Pause className="h-4 w-4 mr-2" />Работаю...</>
                        ) : (
                          <><Play className="h-4 w-4 mr-2" />Запустить фокус на 25 минут</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification */}
          <div className="mb-20">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Геймификация, которая работает
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Зарабатывайте опыт (XP) и монеты за каждую выполненную задачу и сессию фокуса. 
                  Повышайте свой уровень, открывайте достижения и соревнуйтесь с коллегами. 
                  Превратите достижение целей в захватывающее приключение!
                </p>
              </div>
              <div className="mt-10 lg:mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg shadow p-4 text-center">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">47</div>
                    <div className="text-sm text-gray-500">Достижений</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 text-center">
                    <Star className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">Ур. 12</div>
                    <div className="text-sm text-gray-500">Текущий уровень</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4 text-center col-span-2">
                    <div className="text-sm text-gray-500 mb-2">XP до следующего уровня</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">1,950 / 3,000 XP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Garden */}
          <div>
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Ваш Виртуальный Сад Продуктивности
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  Каждая сфокусированная минута помогает вашему виртуальному растению расти. 
                  Заботьтесь о своем саде, поливайте растения и наблюдайте, как он расцветает 
                  вместе с вашей продуктивностью. Это ваше наглядное воплощение приложенных усилий.
                </p>
              </div>
              <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-start-1">
                <div className="bg-gradient-to-b from-blue-400 to-green-400 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-4">🌻</div>
                  <div className="text-white font-semibold">Подсолнух Продуктивности</div>
                  <div className="text-blue-100 text-sm mt-2">Вырос за 15 дней фокуса</div>
                  <div className="mt-4 flex justify-center space-x-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-2xl">🌿</span>
                    <span className="text-2xl">🌸</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Выберите свой путь
            </h2>
            <div className="mt-6">
              <div className="flex items-center justify-center">
                <span className={`mr-3 ${isMonthly ? 'text-gray-900' : 'text-gray-500'}`}>Ежемесячно</span>
                <button
                  onClick={() => setIsMonthly(!isMonthly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isMonthly ? 'bg-gray-200' : 'bg-indigo-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMonthly ? 'translate-x-1' : 'translate-x-6'}`} />
                </button>
                <span className={`ml-3 ${!isMonthly ? 'text-gray-900' : 'text-gray-500'}`}>Ежегодно <span className="text-green-600 font-semibold">(скидка 20%)</span></span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="relative flex flex-col h-full">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Искатель</div>
                  <div className="text-4xl font-bold text-indigo-600 mt-2">0 ₽</div>
                  <div className="text-gray-600 font-medium">навсегда</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-center text-gray-600 mb-6">Идеально для старта и личных задач</p>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Неограниченные личные задачи</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Pomodoro-таймер</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Базовая геймификация</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">1 рабочее пространство</span>
                  </li>
                </ul>
                <div className="mt-auto pt-6">
                  <Button 
                    className="w-full bg-gray-600 text-white hover:bg-gray-700"
                    onClick={() => navigate('/register')}
                  >
                    Начать бесплатно
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative flex flex-col h-full border-2 border-indigo-500 shadow-xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Популярный
                </span>
              </div>
              <CardHeader className="bg-indigo-50 rounded-t-lg pt-8">
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Герой</div>
                  <div className="text-4xl font-bold text-indigo-600 mt-2">
                    {isMonthly ? '299' : '239'} ₽
                  </div>
                  <div className="text-gray-600 font-medium">{isMonthly ? 'в месяц' : 'в месяц (при годовой оплате)'}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-center text-gray-600 mb-6">Для профессионалов, которым нужны все инструменты</p>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Все из "Искателя"</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Неограниченные личные Workspace</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Продвинутая статистика и отчеты</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Пользовательские челленджи</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Интеграция с календарями</span>
                  </li>
                </ul>
                <div className="mt-auto pt-6">
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => navigate('/register')}
                  >
                    Выбрать "Героя"
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="relative flex flex-col h-full">
              <CardHeader className="bg-purple-50 rounded-t-lg">
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Гильдия</div>
                  <div className="text-4xl font-bold text-purple-600 mt-2">
                    {isMonthly ? '249' : '199'} ₽
                  </div>
                  <div className="text-gray-600 font-medium">за пользователя {isMonthly ? 'в месяц' : 'в месяц (при годовой оплате)'}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-center text-gray-600 mb-6">Для совместной работы и управления командой</p>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Все из "Героя"</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Командные Workspace</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Управление ролями и доступом</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Общая Kanban-доска</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Командная аналитика</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Приоритетная поддержка</span>
                  </li>
                </ul>
                <div className="mt-auto pt-6">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => navigate('/register')}
                  >
                    Создать команду
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Часто Задаваемые Вопросы
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Готовы начать свой квест?
          </h2>
          <p className="mt-4 text-xl text-indigo-200">
            Присоединяйтесь к тысячам пользователей, которые уже повысили свою продуктивность
          </p>
          <div className="mt-8">
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-indigo-700 hover:bg-gray-100 font-bold text-lg px-8 py-4"
            >
              🚀 Зарегистрироваться бесплатно
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Продукт</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Возможности</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Тарифы</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Для команд</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Для себя</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Компания</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Блог</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2">
                <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">Центр помощи (FAQ)</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Руководства</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Сообщить об ошибке</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Юридическая информация</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Политика конфиденциальности</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Условия использования</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2025 ProgressQuest Universal. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}