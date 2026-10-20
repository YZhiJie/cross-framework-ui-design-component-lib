import { Carousel } from '@xui-design/react';
import type { CarouselItem } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

const banners: CarouselItem[] = [
  {
    key: 'aurora',
    image:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wide%20abstract%20banner%20of%20smooth%20flowing%20gradient%20waves%20in%20purple%20and%20blue%2C%20soft%20light%2C%20digital%20art&image_size=landscape_16_9',
    alt: 'Aurora gradient',
  },
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
];

export default function TiltDemo() {
  const isZh = useIsZh();

  return (
    <div className="demo-column">
      <Carousel
        items={banners}
        skewed
        interval={4000}
        style={{
          '--xui-carousel-height': '340px',
          '--xui-carousel-slide-width': '55%',
          '--xui-carousel-dim-opacity': '0.45',
        }}
      />
      <span className="demo-text">
        {isZh
          ? 'skewed 倾斜变体：幻灯片平行四边形裁切、内容反向矫正（对应「有倾斜」版本效果）'
          : 'skewed variant: parallelogram slides with counter-skewed content (tilted version)'}
      </span>
    </div>
  );
}
