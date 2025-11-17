"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  Languages,
  Video,
  MessageSquare,
  Settings,
  History,
  Waves,
  Eye,
  Heart,
  Sparkles,
  Globe2
} from 'lucide-react';

interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLang: string;
  toLang: string;
  timestamp: Date;
  emotion: string;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

const emotions = ['Neutral', 'Happy', 'Sad', 'Excited', 'Calm', 'Angry'];

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');
  const [currentText, setCurrentText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [emotion, setEmotion] = useState('Neutral');
  const [volume, setVolume] = useState(0);
  const [mode, setMode] = useState<'voice' | 'video' | 'text'>('voice');
  const [voiceCloneEnabled, setVoiceCloneEnabled] = useState(true);
  const [emotionDetection, setEmotionDetection] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVolume(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVolume(0);
    }
  }, [isListening]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsListening(true);

      // Simulate real-time transcription
      const texts = [
        "Hello, how are you doing today?",
        "I'm exploring this amazing translation technology.",
        "The weather is beautiful this morning.",
        "Can you help me with directions?",
        "This app is incredible!",
      ];

      setTimeout(() => {
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        setCurrentText(randomText);
        translateText(randomText);
      }, 2000);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const translateText = (text: string) => {
    // Simulate translation
    const translations_map: { [key: string]: { [key: string]: string } } = {
      "Hello, how are you doing today?": {
        es: "Hola, ¿cómo estás hoy?",
        fr: "Bonjour, comment allez-vous aujourd'hui?",
        de: "Hallo, wie geht es dir heute?",
        it: "Ciao, come stai oggi?",
        ja: "こんにちは、今日はお元気ですか？",
        zh: "你好，你今天好吗？",
      },
      "I'm exploring this amazing translation technology.": {
        es: "Estoy explorando esta increíble tecnología de traducción.",
        fr: "J'explore cette incroyable technologie de traduction.",
        de: "Ich erkunde diese erstaunliche Übersetzungstechnologie.",
        it: "Sto esplorando questa incredibile tecnologia di traduzione.",
        ja: "この素晴らしい翻訳技術を探求しています。",
        zh: "我正在探索这项令人惊叹的翻译技术。",
      },
    };

    const translated = translations_map[text]?.[toLang] || `[${text} translated to ${toLang}]`;
    setTranslatedText(translated);

    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setEmotion(randomEmotion);

    const newTranslation: Translation = {
      id: Date.now().toString(),
      originalText: text,
      translatedText: translated,
      fromLang,
      toLang,
      timestamp: new Date(),
      emotion: randomEmotion,
    };

    setTranslations(prev => [newTranslation, ...prev]);
    speakTranslation(translated);
  };

  const speakTranslation = (text: string) => {
    setIsSpeaking(true);

    // Simulate speech output
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe2 className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-silver-200 bg-clip-text text-transparent">
              Universal Talking AI
            </h1>
          </div>
          <p className="text-silver-300 text-lg">Your voice echoes in any language</p>
        </motion.header>

        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-4 mb-8"
        >
          {[
            { id: 'voice', icon: Mic, label: 'Voice' },
            { id: 'video', icon: Video, label: 'Video Call' },
            { id: 'text', icon: MessageSquare, label: 'Text Chat' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setMode(id as any)}
              className={`glass-morphism px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                mode === id ? 'bg-blue-600/30 border-blue-400' : 'hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Translation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Selection */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-morphism p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-silver-300 text-sm mb-2 block">From</label>
                  <select
                    value={fromLang}
                    onChange={(e) => setFromLang(e.target.value)}
                    className="w-full bg-primary-800/50 border border-silver-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    const temp = fromLang;
                    setFromLang(toLang);
                    setToLang(temp);
                  }}
                  className="mt-6 p-3 glass-morphism rounded-full hover:bg-white/10 transition-all"
                >
                  <Languages className="w-6 h-6 text-blue-400" />
                </button>

                <div className="flex-1">
                  <label className="text-silver-300 text-sm mb-2 block">To</label>
                  <select
                    value={toLang}
                    onChange={(e) => setToLang(e.target.value)}
                    className="w-full bg-primary-800/50 border border-silver-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Voice Visualization & Control */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-morphism p-8 rounded-2xl relative overflow-hidden"
            >
              {/* Audio Visualization */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <motion.div
                  animate={{
                    scale: isListening ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl"
                />
              </div>

              <div className="relative z-10">
                {/* Microphone Button */}
                <div className="flex justify-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500 pulse-glow'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-16 h-16" />
                    ) : (
                      <Mic className="w-16 h-16" />
                    )}
                  </motion.button>
                </div>

                {/* Volume Visualization */}
                {isListening && (
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: `${Math.random() * volume}%`,
                        }}
                        transition={{
                          duration: 0.1,
                          repeat: Infinity,
                        }}
                        className="w-2 bg-blue-400 rounded-full"
                        style={{ minHeight: '10%' }}
                      />
                    ))}
                  </div>
                )}

                {/* Status */}
                <div className="text-center mb-4">
                  {isListening ? (
                    <p className="text-blue-300 flex items-center justify-center gap-2">
                      <Waves className="w-5 h-5 animate-pulse" />
                      Listening...
                    </p>
                  ) : isSpeaking ? (
                    <p className="text-green-300 flex items-center justify-center gap-2">
                      <Volume2 className="w-5 h-5 animate-pulse" />
                      Speaking in cloned voice...
                    </p>
                  ) : (
                    <p className="text-silver-400">Tap to start speaking</p>
                  )}
                </div>

                {/* Original Text */}
                {currentText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-800/50 rounded-xl p-4 mb-4"
                  >
                    <p className="text-silver-300 text-sm mb-1">Original:</p>
                    <p className="text-lg">{currentText}</p>
                  </motion.div>
                )}

                {/* Translated Text */}
                {translatedText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-600/20 rounded-xl p-4 border border-blue-400/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-blue-300 text-sm">Translated:</p>
                      {emotionDetection && (
                        <span className="text-xs bg-purple-600/30 px-2 py-1 rounded-full flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {emotion}
                        </span>
                      )}
                    </div>
                    <p className="text-lg">{translatedText}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-morphism p-6 rounded-2xl"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Features
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">Voice Cloning</span>
                  </div>
                  <button
                    onClick={() => setVoiceCloneEnabled(!voiceCloneEnabled)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      voiceCloneEnabled ? 'bg-blue-600' : 'bg-silver-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: voiceCloneEnabled ? 24 : 0 }}
                      className="w-6 h-6 bg-white rounded-full"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <span className="text-sm">Emotion Detection</span>
                  </div>
                  <button
                    onClick={() => setEmotionDetection(!emotionDetection)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      emotionDetection ? 'bg-blue-600' : 'bg-silver-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: emotionDetection ? 24 : 0 }}
                      className="w-6 h-6 bg-white rounded-full"
                    />
                  </button>
                </div>

                <div className="pt-4 border-t border-silver-700">
                  <p className="text-xs text-silver-400 mb-2">Active Features:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-600/30 px-2 py-1 rounded-full">
                      Real-time Translation
                    </span>
                    <span className="text-xs bg-purple-600/30 px-2 py-1 rounded-full">
                      Multi-language
                    </span>
                    <span className="text-xs bg-green-600/30 px-2 py-1 rounded-full">
                      Cross-platform
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* History Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-morphism p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  History
                </h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {showHistory ? 'Hide' : 'Show'}
                </button>
              </div>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 max-h-96 overflow-y-auto"
                  >
                    {translations.length === 0 ? (
                      <p className="text-silver-400 text-sm text-center py-4">
                        No translations yet
                      </p>
                    ) : (
                      translations.map((t) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-primary-800/30 rounded-lg p-3 text-sm"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-silver-400">
                              {languages.find(l => l.code === t.fromLang)?.flag} → {languages.find(l => l.code === t.toLang)?.flag}
                            </span>
                            <span className="text-xs text-silver-500">
                              {t.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-silver-300 text-xs mb-1">{t.originalText}</p>
                          <p className="text-blue-300 text-xs">{t.translatedText}</p>
                          {emotionDetection && (
                            <span className="text-xs text-purple-400 mt-1 inline-block">
                              {t.emotion}
                            </span>
                          )}
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-morphism p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-4">Session Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-800/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">{translations.length}</p>
                  <p className="text-xs text-silver-400">Translations</p>
                </div>
                <div className="bg-primary-800/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{languages.length}</p>
                  <p className="text-xs text-silver-400">Languages</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-silver-400 text-sm"
        >
          <p>🌐 Connect voices, not just words • Speak without barriers</p>
        </motion.footer>
      </div>
    </div>
  );
}
