import { useState } from 'react';
import { Carousel } from '@xui-design/react';
import type { CarouselItem } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

const banners: CarouselItem[] = [
  {
    key: 'mountain',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wide%20banner%20photo%20of%20a%20mountain%20lake%20at%20sunrise%2C%20mist%20over%20calm%20water%2C%20warm%20gradient%20sky%2C%20minimal%20landscape%20photography&image_size=landscape_16_9',
    alt: 'Mountain sunrise',
  },
  {
    key: 'city',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wide%20banner%20photo%20of%20modern%20city%20skyline%20at%20dusk%2C%20blue%20hour%2C%20glowing%20skyscraper%20lights&image_size=landscape_16_9',
    alt: 'City skyline',
  },
  {
    key: 'beach',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wide%20banner%20photo%20of%20tropical%20beach%20with%20turquoise%20sea%2C%20aerial%20drone%20view%2C%20white%20sand&image_size=landscape_16_9',
    alt: 'Tropical beach',
  },
];

export default function BasicDemo() {
  const isZh = useIsZh();
  const [current, setCurrent] = useState(0);

  return (
    <div className="demo-column">
      <Carousel
        items={banners}
        value={current}
        onChange={setCurrent}
        style={{
          '--xui-carousel-height': '320px',
          '--xui-carousel-slide-width': '60%',
        }}
      />
      <span className="demo-text">
        {isZh ? `当前：第 ${current + 1} 张` : `Current: slide ${current + 1}`}
      </span>
    </div>
  );
}
