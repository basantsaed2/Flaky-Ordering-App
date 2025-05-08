import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
      translation: {
        "menu": "Menu",
        "orderOnline": "Order Online",
        "branch": "Branch",
        "Flaky": "Flaky",
        "login": "Login",
        "signUp": "Sign Up",
        "favorites": "Favorites",
        "cart": "Cart",
        "profile": "Profile",
        "contactUs": "Contact Us",
        "loadingLanguages": "Loading languages..."
      },
    },
    ar: {
      translation: {
        "menu": "القائمة",
        "orderOnline": "اطلب الآن",
        "branch": "فروع",
        "Flaky": "السلطان ايوب",
        "login": "تسجيل الدخول",
        "signUp": "تسجيل",
        "favorites": "المفضلة",
        "cart": "السلة",
        "profile": "الملف الشخصي",
        "contactUs": "اتصل بنا",
        "loadingLanguages": "جاري تحميل اللغات..."
      },
    },
};  

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
