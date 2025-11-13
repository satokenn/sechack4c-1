import React, { useState, useEffect } from 'react'

interface IntroScene {
  id: number
  imageSrc: string
  text: string
}

interface Phase1Props {
  onComplete?: () => void
}

// シナリオデータ
const INTRO_SCENES: IntroScene[] = [
  {
    id: 1,
    imageSrc: '/assets/intro/scene_01.png',
    text: '静かなオフィス。経理部の鈴木さんは、たくさんの書類に囲まれたデスクでパソコンに向かっています。「ふぅ、もう少しで終わりそう...」時刻は、午前10時を少し回ったところでした。'
  },
  {
    id: 2,
    imageSrc: '/assets/intro/scene_02.png',
    text: 'その時、パソコンの画面に新しいメールが届いたことを知らせる通知がポップアップしました。件名は『【至急ご確認】請求書送付の件』。送信元は、いつもやり取りしている取引先の名前です。'
  },
  {
    id: 3,
    imageSrc: '/assets/intro/scene_03.png',
    text: '「あ、これ、昨日催促した請求書だわ。すぐに送ってくれて助かったな。」鈴木さんはほっと一息つき、何の疑いもなくメールに添付されていたファイル「請求書_20251112.zip」をクリックしました。'
  },
  {
    id: 4,
    imageSrc: '/assets/intro/scene_04.png',
    text: 'カチッ。鈴木さんが「請求書.exe」をダブルクリックした瞬間、一瞬だけ黒い画面がパッと表示され、すぐに消えてしまいました。'
  },
  {
    id: 5,
    imageSrc: '/assets/intro/scene_05.png',
    text: '「あれ？開かないな...ファイルが壊れているのかしら。」でも、彼女は山積みの仕事に追われていました。「まあ、忙しいし、あとで再送してもらおう。」そう判断すると、すぐに別の作業に戻ってしまいました。'
  },
  {
    id: 6,
    imageSrc: '/assets/intro/scene_06.png',
    text: '鈴木さんには、まったく見えていませんでした。彼女のパソコンの中、その暗闇の奥深くで、さっきのプログラムが静かに目を覚ましたのです。それはまるで、獲物を狙う獣の目のように、赤く、不気味に光っていました。'
  },
  {
    id: 7,
    imageSrc: '/assets/intro/scene_07.png',
    text: '赤く光る目から、暗くて細い触手のようなものが、ゆっくりと伸びていきます。その触手は、パソコンを守っている壁をすり抜けて、インターネットの外にある、恐ろしいサーバーへと静かに手を伸ばし始めました。'
  },
  {
    id: 8,
    imageSrc: '/assets/intro/scene_08.png',
    text: 'その頃、セキュリティ監視室のモニターの中央に、一つの赤い警告が「ピコン！」という音とともに点灯しました。何かが、起きています。'
  }
]

export default function Phase1({ onComplete }: Phase1Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showImage, setShowImage] = useState(true)

  const currentScene = INTRO_SCENES[currentIndex]

  // タイプライター効果
  useEffect(() => {
    if (!currentScene) return

    setIsTyping(true)
    setDisplayedText('')
    setShowImage(true)

    const text = currentScene.text
    let charIndex = 0

    const typeTimer = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeTimer)
      }
    }, 30) // 30msごとに1文字表示

    return () => clearInterval(typeTimer)
  }, [currentIndex])

  function handleNext() {
    if (isTyping) {
      // タイピング中の場合は即座に全文表示
      setDisplayedText(currentScene.text)
      setIsTyping(false)
      return
    }

    if (currentIndex < INTRO_SCENES.length - 1) {
      // 次のシーンへ
      setCurrentIndex(currentIndex + 1)
    } else {
      // 最後のシーンの場合、フェーズ2へ遷移
      if (onComplete) {
        onComplete()
      }
    }
  }

  function handleSkip() {
    if (onComplete) {
      onComplete()
    }
  }

  // 画像エラー時のフォールバック
  function handleImageError() {
    setShowImage(false)
  }

  return (
    <div className="phase1" onClick={handleNext}>
      {/* スキップボタン */}
      <button
        className="skip-button"
        onClick={(e) => {
          e.stopPropagation()
          handleSkip()
        }}
      >
        Skip ≫
      </button>

      {/* メインビジュアルエリア */}
      <div className="scene-container">
        {showImage ? (
          <img
            src={currentScene.imageSrc}
            alt={`Scene ${currentScene.id}`}
            className="scene-image"
            onError={handleImageError}
          />
        ) : (
          <div className="scene-placeholder">
            <p>シーン {currentScene.id}</p>
            <p className="placeholder-note">
              画像: {currentScene.imageSrc}
            </p>
          </div>
        )}

        {/* テキストボックス */}
        <div className="text-box">
          <p className="scene-text">{displayedText}</p>
          {!isTyping && (
            <div className="next-indicator">
              {currentIndex < INTRO_SCENES.length - 1 ? (
                <span>クリックして次へ ▶</span>
              ) : (
                <span>クリックしてゲーム開始 ▶</span>
              )}
            </div>
          )}
        </div>

        {/* 進行状況インジケーター */}
        <div className="progress-indicator">
          {INTRO_SCENES.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentIndex ? 'active' : ''} ${
                index < currentIndex ? 'completed' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .phase1 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          cursor: pointer;
          overflow: hidden;
        }

        .skip-button {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 100;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.5);
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: white;
          transform: translateY(-2px);
        }

        .scene-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .scene-image {
          max-width: 90%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .scene-placeholder {
          width: 80%;
          max-width: 800px;
          height: 60vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .placeholder-note {
          font-size: 14px;
          margin-top: 10px;
          opacity: 0.8;
        }

        .text-box {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          max-width: 900px;
          background: rgba(0, 0, 0, 0.85);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          padding: 25px 30px;
          backdrop-filter: blur(10px);
        }

        .scene-text {
          color: white;
          font-size: 18px;
          line-height: 1.8;
          margin: 0;
          min-height: 60px;
        }

        .next-indicator {
          text-align: right;
          margin-top: 15px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .progress-indicator {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: white;
          transform: scale(1.3);
        }

        .progress-dot.completed {
          background: rgba(100, 200, 255, 0.8);
        }

        @media (max-width: 768px) {
          .text-box {
            width: 90%;
            padding: 20px;
          }

          .scene-text {
            font-size: 16px;
          }

          .skip-button {
            top: 10px;
            right: 10px;
            padding: 8px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}
