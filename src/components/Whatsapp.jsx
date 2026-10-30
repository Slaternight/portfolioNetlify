import { FloatingWhatsApp } from "react-floating-whatsapp";
import pictureMineChat from "../assets/profile/ft.png";
import { useLanguage } from "../i18n/LanguageContext";
import { profile } from "../data/profile";

export default function Whatsapp() {
  const { t } = useLanguage();

  return (
    <FloatingWhatsApp
      phoneNumber={profile.phoneRaw}
      accountName={profile.shortName}
      chatMessage={t.whatsapp.chat}
      statusMessage={t.whatsapp.status}
      placeholder={t.whatsapp.placeholder}
      allowEsc
      allowClickAway
      notification
      notificationSound
      avatar={pictureMineChat}
      darkMode
    />
  );
}
