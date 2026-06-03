import React from 'react';
import { ExternalLink } from 'lucide-react';

export const AdBannerMock: React.FC = () => {
  const ads = [
    {
      title: "따뜻한 대화를 돕는 블렌딩 티",
      desc: "소중한 사람과의 소소한 일상 대화를 더 부드럽게 이어주는 '온기차' 기프트 세트 🍵",
      link: "오늘의 후원사 | 온기 다원",
    },
    {
      title: "매일 전하는 작지만 확실한 진심",
      desc: "소홀해진 관계를 위한 365일 안부 실천 가이드, 화제의 도서 [오늘의 안부] 출간! 📖",
      link: "오늘의 후원사 | 코지 북스",
    },
    {
      title: "마음의 온도를 올리는 커피 한 잔",
      desc: "전국 100개 매장에서 즉시 교환 가능한 따뜻한 '안심 브루잉 커피' 특별 할인 ☕",
      link: "오늘의 후원사 | 마음 카페",
    }
  ];

  // Pick one ad based on the day of the month so it is stable but rotates
  const ad = ads[new Date().getDate() % ads.length];

  return (
    <div className="ad-banner-mock">
      <div className="ad-badge">AD</div>
      <div className="ad-content">
        <h5 className="ad-title">{ad.title}</h5>
        <p className="ad-desc">{ad.desc}</p>
        <span className="ad-link">
          {ad.link} <ExternalLink size={9} style={{ display: 'inline', marginLeft: '2px', verticalAlign: 'middle' }} />
        </span>
      </div>
    </div>
  );
};
