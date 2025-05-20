import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, LogOut, Edit, Check, X, Lock, Globe, RefreshCw, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout, isLoggingOut } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editedName, setEditedName] = useState(authUser?.fullName || "");
  const [editedUsername, setEditedUsername] = useState(authUser?.username || "");
  const [editedStatus, setEditedStatus] = useState(authUser?.status || "Привет! Я использую это приложение");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Файл слишком большой (макс. 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Фото профиля обновлено!");
      } catch (error) {
        toast.error("Ошибка при обновлении фото");
      }
    };
  };

  const handleNameUpdate = async () => {
    if (!editedName.trim()) {
      toast.error("Имя не может быть пустым");
      return;
    }

    if (editedName.length > 30) {
      toast.error("Имя не должно превышать 30 символов");
      return;
    }

    try {
      await updateProfile({ fullName: editedName });
      toast.success("Имя успешно обновлено!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Ошибка при обновлении имени");
    }
  };

  const handleUsernameUpdate = async () => {
    if (!editedUsername.trim()) {
      toast.error("Никнейм не может быть пустым");
      return;
    }

    if (editedUsername.length < 3 || editedUsername.length > 20) {
      toast.error("Никнейм должен быть от 3 до 20 символов");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(editedUsername)) {
      toast.error("Никнейм может содержать только буквы, цифры и подчеркивания");
      return;
    }

    try {
      await updateProfile({ username: editedUsername });
      toast.success("Никнейм успешно обновлен!");
      setIsEditingUsername(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при обновлении никнейма");
    }
  };

  const handleStatusUpdate = async () => {
    if (!editedStatus.trim()) {
      toast.error("Статус не может быть пустым");
      return;
    }

    if (editedStatus.length > 100) {
      toast.error("Статус не должен превышать 100 символов");
      return;
    }

    try {
      await updateProfile({ status: editedStatus });
      toast.success("Статус успешно обновлен!");
      setIsEditingStatus(false);
    } catch (error) {
      toast.error("Ошибка при обновлении статуса");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Вы успешно вышли из системы");
    navigate("/login");
  };

  const resetNameField = () => {
    setEditedName(authUser.fullName);
    toast("Имя сброшено к исходному");
  };

  const resetUsernameField = () => {
    setEditedUsername(authUser.username || "");
    toast("Никнейм сброшен к исходному");
  };

  const resetStatusField = () => {
    setEditedStatus(authUser.status || "Привет! Я использую это приложение");
    toast("Статус сброшен к исходному");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 pt-20 pb-10">
      <div className="max-w-md mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300 transition-all duration-300 hover:shadow-2xl">
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-primary to-primary-focus p-6 text-center">
            <h1 className="text-2xl font-bold text-primary-content">Мой профиль</h1>
            <p className="text-primary-content/80 mt-1">Управление учетной записью</p>
          </div>

          {/* Avatar Section */}
          <div className="px-6 pt-6 pb-2 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 scale-95 group-hover:scale-105"></div>
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="relative size-28 rounded-full object-cover border-4 border-white shadow-lg z-10 transition-transform duration-300 group-hover:scale-105"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute -bottom-2 -right-2 
                  bg-primary hover:bg-primary-focus
                  p-2.5 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-lg
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  group-hover:scale-110 z-20
                `}
                title="Изменить фото"
              >
                <Camera className="w-4 h-4 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-base-content">
                {authUser?.fullName}
              </h2>
              <p className="text-sm text-base-content/70 mt-1">@{authUser?.username || authUser?.email.split('@')[0]}</p>
            </div>
          </div>

          {/* Status Message */}
          <div className="mx-6 mt-4 bg-primary/5 rounded-xl p-3 border border-primary/10 transition-all hover:border-primary/20">
            {isEditingStatus ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="flex-1 px-4 py-2 bg-base-200 rounded-lg border border-primary focus:border-primary-focus focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                    placeholder="Введите ваш статус"
                    onKeyDown={(e) => e.key === 'Enter' && handleStatusUpdate()}
                    autoFocus
                  />
                  <button
                    onClick={handleStatusUpdate}
                    className={`btn btn-square btn-sm ${isUpdatingProfile ? 'btn-disabled' : 'btn-success'}`}
                    disabled={isUpdatingProfile}
                    aria-label="Сохранить статус"
                  >
                    {isUpdatingProfile ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingStatus(false);
                      resetStatusField();
                    }}
                    className="btn btn-square btn-sm btn-error"
                    aria-label="Отменить изменения"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-base-content/60 text-right">
                  {editedStatus.length}/100 символов
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-base-content/90 italic text-center">"{authUser?.status || "Привет! Я использую это приложение"}"</p>
                <button 
                  className="mt-1 text-xs text-primary hover:text-primary-focus font-medium flex items-center gap-1"
                  onClick={() => setIsEditingStatus(true)}
                >
                  <Smile className="w-3 h-3" />
                  <span>Изменить статус</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="p-6 space-y-4">
            {/* Editable Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <User className="w-4 h-4" />
                Полное имя
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 px-4 py-2 bg-base-200 rounded-lg border border-primary focus:border-primary-focus focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                      placeholder="Введите ваше имя"
                      onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
                      autoFocus
                    />
                    <button
                      onClick={handleNameUpdate}
                      className={`btn btn-square btn-sm ${isUpdatingProfile ? 'btn-disabled' : 'btn-success'}`}
                      disabled={isUpdatingProfile}
                      aria-label="Сохранить изменения"
                    >
                      {isUpdatingProfile ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        resetNameField();
                      }}
                      className="btn btn-square btn-sm btn-error"
                      aria-label="Отменить изменения"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetNameField}
                      className="btn btn-square btn-sm btn-ghost"
                      title="Сбросить к исходному имени"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  {editedName.length > 30 && (
                    <p className="text-xs text-error mt-1">
                      Имя не должно превышать 30 символов
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center px-4 py-2 bg-base-200 rounded-lg border border-base-300 hover:border-primary/50 transition-colors">
                  <p className="font-medium">{authUser?.fullName}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-ghost btn-sm hover:bg-primary/10"
                    title="Редактировать имя"
                  >
                    <Edit className="w-4 h-4 text-base-content/70 hover:text-primary" />
                  </button>
                </div>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <User className="w-4 h-4" />
                Никнейм
              </label>
              {isEditingUsername ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="flex-1 px-4 py-2 bg-base-200 rounded-lg border border-primary focus:border-primary-focus focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                      placeholder="Введите ваш никнейм"
                      onKeyDown={(e) => e.key === 'Enter' && handleUsernameUpdate()}
                      autoFocus
                    />
                    <button
                      onClick={handleUsernameUpdate}
                      className={`btn btn-square btn-sm ${isUpdatingProfile ? 'btn-disabled' : 'btn-success'}`}
                      disabled={isUpdatingProfile}
                      aria-label="Сохранить никнейм"
                    >
                      {isUpdatingProfile ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false);
                        resetUsernameField();
                      }}
                      className="btn btn-square btn-sm btn-error"
                      aria-label="Отменить изменения"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetUsernameField}
                      className="btn btn-square btn-sm btn-ghost"
                      title="Сбросить к исходному никнейму"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-base-content/60">
                    Можно использовать буквы, цифры и подчеркивания (3-20 символов)
                  </p>
                </div>
              ) : (
                <div className="flex justify-between items-center px-4 py-2 bg-base-200 rounded-lg border border-base-300 hover:border-primary/50 transition-colors">
                  <p className="font-medium">@{authUser?.username || "не установлен"}</p>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="btn btn-ghost btn-sm hover:bg-primary/10"
                    title="Редактировать никнейм"
                  >
                    <Edit className="w-4 h-4 text-base-content/70 hover:text-primary" />
                  </button>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <div className="flex justify-between items-center px-4 py-2 bg-base-200 rounded-lg border border-base-300">
                <p className="font-medium">{authUser?.email}</p>
                <Lock className="w-4 h-4 text-base-content/50" />
              </div>
            </div>

            {/* Timezone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Часовой пояс
              </label>
              <div className="flex justify-between items-center px-4 py-2 bg-base-200 rounded-lg border border-base-300 hover:border-primary/50 transition-colors">
                <p className="font-medium">UTC+3 (Москва)</p>
                <button 
                  className="btn btn-ghost btn-sm hover:bg-primary/10"
                  onClick={() => toast("Эта функция скоро будет доступна!")}
                >
                  <Edit className="w-4 h-4 text-base-content/70 hover:text-primary" />
                </button>
              </div>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="mx-6 mt-4 mb-6 bg-base-200 rounded-xl p-4 border border-base-300">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-base-content">
              <User className="w-5 h-5 text-primary" />
              Информация об аккаунте
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span className="text-base-content/70">Участник с</span>
                <span className="font-medium">
                  {new Date(authUser.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-base-300">
                <span className="text-base-content/70">Последний вход</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base-content/70">Статус аккаунта</span>
                <span className="badge badge-success badge-sm">Активен</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6 flex flex-col gap-3">
            <button
              onClick={() => toast("Эта функция скоро будет доступна!")}
              className="btn btn-outline btn-primary hover:bg-primary/10 hover:border-primary/50 transition-colors"
            >
              Настройки учетной записи
            </button>
            
            <button
              onClick={handleLogout}
              className={`
                btn btn-outline btn-error
                transition-colors duration-200
                flex items-center gap-2 hover:bg-error/10
              `}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  <span>Выйти из аккаунта</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;