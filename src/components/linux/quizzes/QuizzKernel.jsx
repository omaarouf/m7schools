import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    type: "qcm",
    question: "Quelle commande affiche la version du noyau Linux actuellement démarré ?",
    options: ["kernel --version", "uname -r", "lsmod -v", "dmesg --version"],
    correct: 1,
    explanation: "`uname -r` affiche la version du noyau actuellement actif.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quelle commande liste les modules du noyau actuellement chargés ?",
    options: ["modinfo", "modprobe", "lsmod", "sysctl"],
    correct: 2,
    explanation: "`lsmod` affiche la liste des modules chargés. `modinfo` affiche les informations sur un module précis.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quelle commande consulte les messages du noyau dans le journal systemd ?",
    options: ["journalctl -k", "systemctl kernel", "journalctl -u kernel", "dmesg -s"],
    correct: 0,
    explanation: "`journalctl -k` affiche les messages du noyau enregistrés depuis le démarrage.",
  },
];

export default function QuizzKernel() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz - Noyau Linux"
      courseLink="/cours/linux/lesson-13"
    />
  );
}
