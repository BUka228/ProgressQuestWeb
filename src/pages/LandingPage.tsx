import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingPage() {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">ProgressQuest Universal</h1>
        <p className="text-xl text-muted-foreground">
          Ваша интегрированная платформа для повышения личной и командной продуктивности.
        </p>
      </header>

      <section className="text-center mb-16">
        <Button size="lg" onClick={handleGoogleLogin}>
          Начать с Google
        </Button>
        <p className="text-sm text-muted-foreground mt-2">Присоединяйтесь и начните свой квест к продуктивности!</p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Гибкое Управление Задачами</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Поддержка различных методологий (GTD, Матрица Эйзенхауэра) для идеальной организации вашей работы.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Продвинутый Pomodoro-таймер</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Автоматическая генерация плана сессий для максимальной концентрации и эффективности.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Многоуровневая Геймификация</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Повышайте мотивацию через систему уровней, достижений и наград, превращая работу в увлекательный квест.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Ключевые Возможности</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Для личного использования</h3>
            <ul className="space-y-2">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span>Управляйте задачами и временем с помощью техники Pomodoro.</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span>Отслеживайте личный прогресс и достижения.</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span>Создавайте собственные челленджи для дополнительной мотивации.</span></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Для командной работы</h3>
            <ul className="space-y-2">
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span>Прозрачное распределение и отслеживание командных задач.</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span>Повышение вовлеченности через командные челленджи и статистику.</span></li>
              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span>Гибкая настройка рабочих пространств под нужды команды.</span></li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="text-center text-muted-foreground">
        <p>&copy; 2025 ProgressQuest Universal. Все права защищены.</p>
      </footer>
    </div>
  );
}