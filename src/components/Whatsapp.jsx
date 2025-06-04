import { FloatingWhatsApp } from 'react-floating-whatsapp'

export default function Whatsapp() {

  return (
      <FloatingWhatsApp
        phoneNumber="+573208441575"
        accountName="Slayder"
        allowEsc
        allowClickAway
        notification
        notificationSound
        avatar="./src/assets/profile/ft.png"
         />
  )
}