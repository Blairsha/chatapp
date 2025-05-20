import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, MessageSquare, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import LandingBackgroundPattern from "../components/LandingBackgroundPattern";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore();
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let error = "";
        
        switch (name) {
            case "fullName":
                if (!value.trim()) error = "Укажите полное имя";
                else if (value.length < 2) error = "Имя слишком короткое";
                break;
            case "email":
                if (!value.trim()) error = "Укажите email";
                else if (!/\S+@\S+\.\S+/.test(value)) error = "Неверный формат email";
                break;
            case "password":
                if (!value) error = "Укажите пароль";
                else if (value.length < 6) error = "Пароль должен содержать не менее 6 символов";
                break;
            default:
                break;
        }
        
        setErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.dismiss();

        // Валидация всех полей
        const isFullNameValid = validateField("fullName", formData.fullName);
        const isEmailValid = validateField("email", formData.email);
        const isPasswordValid = validateField("password", formData.password);

        if (!isFullNameValid || !isEmailValid || !isPasswordValid) {
            toast.error("Пожалуйста, исправьте ошибки в форме");
            return;
        }

        try {
            const result = await signup(formData);
            
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Аккаунт успешно создан!");
                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Произошла ошибка при регистрации. Попробуйте позже.");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Создать аккаунт</h1>
                            <p className="text-base-content/60">Начните с бесплатного аккаунта</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Полное имя</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    className={`input input-bordered w-full pl-10 ${errors.fullName ? "input-error" : ""}`}
                                    placeholder="Иван Иванов"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.fullName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.fullName}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    className={`input input-bordered w-full pl-10 ${errors.email ? "input-error" : ""}`}
                                    placeholder="example@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.email}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Пароль</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className={`input input-bordered w-full pl-10 ${errors.password ? "input-error" : ""}`}
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                                </button>
                            </div>
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password}</span>
                                </label>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full mt-6"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Регистрация...
                                </>
                            ) : (
                                "Зарегистрироваться"
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-base-content/60">
                            Уже есть аккаунт?{" "}
                            <a href="/login" className="text-primary hover:underline">
                                Войдите здесь
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <LandingBackgroundPattern
                title="Присоединяйтесь к нашему сообществу"
                subtitle="Общайтесь с друзьями, делитесь моментами и оставайтесь на связи"
            />
        </div>
    );
};

export default SignUpPage;