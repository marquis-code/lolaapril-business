import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyD50Qk8iUpxuXxYrGXaHpftTk8d3pHtUyk",
    authDomain: "lolaapril-wellness.firebaseapp.com",
    projectId: "lolaapril-wellness",
    storageBucket: "lolaapril-wellness.appspot.com",
    messagingSenderId: "630281833424",
    appId: "1:630281833424:web:99cdd66d7013d873a9c7d5",
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  return {
    provide: {
      firebaseAuth: auth,
    },
  }
})
