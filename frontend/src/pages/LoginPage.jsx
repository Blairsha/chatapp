import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import LandingBackgroundPattern from "../components/LandingBackgroundPattern";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData);
      if (result?.success) {
        toast.success("Успешный вход в систему");
      } else if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast.error("Произошла ошибка при входе. Попробуйте позже.");
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Левая часть - Форма */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Логотип */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Добро пожаловать</h1>
              <p className="text-base-content/60">Войдите в свой аккаунт</p>
            </div>
          </div>

          {/* Форма входа */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Электронная почта</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="ваш@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Пароль</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Вход в систему...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Ещё нет аккаунта?{" "}
              <Link to="/signup" className="link link-primary">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Правая часть - Изображение */}
      <LandingBackgroundPattern
        title={"С возвращением!"}
        subtitle={"Войдите, чтобы продолжить общение с друзьями и коллегами."}
      />
    </div>
  );
};

export default LoginPage;