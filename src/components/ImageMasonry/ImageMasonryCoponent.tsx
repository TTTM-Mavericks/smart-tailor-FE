import * as React from 'react';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import style from './ImageMasonryStyle.module.scss'

export default function ImageMasonry() {

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollContainer = containerRef.current;

    const scrollStep = () => {
      if (scrollContainer) {
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
          scrollContainer.scrollTop = 0;
        } else {
          scrollContainer.scrollTop += 1;
        }
      }
    };

    const scrollInterval = setInterval(scrollStep, 30);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div ref={containerRef} className={`${style.container}`} >
      <Masonry columns={5}>
        {itemData.map((item, index) => (
          <div key={index} style={{ margin: 5 }}>
            <img
              srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
              src={`${item.img}?w=162&auto=format`}
              alt={item.title}
              loading="lazy"
              style={{
                borderRadius: 4,
                display: 'block',
                width: '100%',
              }}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
}

const itemData = [
  {
    img: 'https://i.pinimg.com/564x/3c/4c/62/3c4c6218cd2d8a33248c8f82a999d294.jpg',
    title: 'Fern',
  },
  {
    img: 'https://i.pinimg.com/564x/0a/9d/5e/0a9d5eed5cc868531de18972fcc2e659.jpg',
    title: 'Snacks',
  },
  {
    img: 'https://i.pinimg.com/564x/1a/76/83/1a768331032420f04c797dd09c1911b2.jpg',
    title: 'Mushrooms',
  },
  {
    img: 'https://i.pinimg.com/564x/78/a5/ed/78a5ed8713dcfebc630d43e47f9df453.jpg',
    title: 'Tower',
  },
  {
    img: 'https://i.pinimg.com/236x/c5/22/90/c5229020ca7e20384584c442061db17d.jpg',
    title: 'Sea star',
  },
  {
    img: 'https://i.pinimg.com/236x/13/b5/fb/13b5fb910eed100bf2fcbadcb633ab2d.jpg',
    title: 'Honey',
  },
  {
    img: 'https://i.pinimg.com/236x/de/97/ac/de97ac8517b528e8bc5df033861a2fe5.jpg',
    title: 'Basketball',
  },
  {
    img: 'https://i.pinimg.com/236x/08/d7/96/08d796f0ef9b2d8b437163b52ceef2f2.jpg',
    title: 'Breakfast',
  },
  {
    img: 'https://i.pinimg.com/236x/75/39/07/75390728f152a5f500a8aecc14adc123.jpg',
    title: 'Tree',
  },
  {
    img: 'https://i.pinimg.com/236x/a2/11/79/a211796299b488dd74f1aa76e4e85df5.jpg',
    title: 'Burger',
  },
  {
    img: 'https://i.pinimg.com/236x/92/ba/d0/92bad0022f201f36842099fba3e290a8.jpg',
    title: 'Camera',
  },
  {
    img: 'https://i.pinimg.com/236x/37/7b/93/377b9309a2236126b3f42c871f58b9b2.jpg',
    title: 'Coffee',
  },
  {
    img: 'https://i.pinimg.com/236x/4f/59/fc/4f59fcca30024688c1c7294fe6c05a81.jpg',
    title: 'Camping Car',
  },
  {
    img: 'https://i.pinimg.com/236x/f6/8f/83/f68f83a809e6339888702b76849f2347.jpg',
    title: 'Hats',
  },
  {
    img: 'https://i.pinimg.com/236x/15/52/1e/15521ed222ad748e6e85a0ba9e0aa0cc.jpg',
    title: 'Tomato basil',
  },
  {
    img: 'https://i.pinimg.com/236x/ba/4c/a5/ba4ca5ed3d693bd212d122b6647cd516.jpg',
    title: 'Mountain',
  },
  {
    img: 'https://i.pinimg.com/236x/d1/2f/85/d12f856d28141ab2a597f35cc68d4968.jpg',
    title: 'Bike',
  },
  {
    img: 'https://i.pinimg.com/236x/25/35/aa/2535aa1ece70b37cd885016715eea125.jpg',
    title: 'Fern',
  },
  {
    img: 'https://i.pinimg.com/236x/f3/9d/8b/f39d8b5760f39ca76b06a5bb4bd00809.jpg',
    title: 'Snacks',
  },
  {
    img: 'https://i.pinimg.com/236x/d8/fe/19/d8fe19282f306c026565410469072769.jpg',
    title: 'Mushrooms',
  },
  {
    img: 'https://i.pinimg.com/236x/ad/23/76/ad237618a0a2d19a36ff2bd339e74c52.jpg',
    title: 'Tower',
  },
  {
    img: 'https://i.pinimg.com/236x/28/c4/da/28c4da2b517425f006d16bb5f67a1e6a.jpg',
    title: 'Sea star',
  },
  {
    img: 'https://i.pinimg.com/236x/9a/6c/c6/9a6cc62adf44fd182b6c083422ef8981.jpg',
    title: 'Honey',
  },
  {
    img: 'https://i.pinimg.com/236x/35/a4/f3/35a4f3d59a18d1d4f7bc4b39fcc6ca9a.jpg',
    title: 'Basketball',
  },
  {
    img: 'https://i.pinimg.com/236x/34/68/2f/34682f44c36d2a8dda4170946afbbe3b.jpg',
    title: 'Breakfast',
  },
  {
    img: 'https://i.pinimg.com/236x/59/04/a2/5904a2cc3e0982f9be0c44c241efab38.jpg',
    title: 'Tree',
  },
  {
    img: 'https://i.pinimg.com/236x/56/37/a7/5637a7bc7b8185568558701eed086caf.jpg',
    title: 'Burger',
  },
  {
    img: 'https://i.pinimg.com/236x/6e/7b/80/6e7b80f12cc5980cf005d37c26cd392d.jpg',
    title: 'Camera',
  },
  {
    img: 'https://i.pinimg.com/236x/07/f5/9f/07f59f8dba53829f98fcf210bd6d2d29.jpg',
    title: 'Coffee',
  },
  {
    img: 'https://i.pinimg.com/236x/ab/69/97/ab699759977d04a54eae73b5f17ed707.jpg',
    title: 'Camping Car',
  },
  {
    img: 'https://i.pinimg.com/236x/a2/63/a1/a263a141de61c4bdb1e371c80f2d8fe0.jpg',
    title: 'Hats',
  },
  {
    img: 'https://i.pinimg.com/236x/07/81/83/07818363fd4668c4a14bbc43c1270f49.jpg',
    title: 'Tomato basil',
  },
  {
    img: 'https://i.pinimg.com/474x/7e/7a/74/7e7a74ecb7293122b174a90aaa42a68e.jpg',
    title: 'Mountain',
  },
  {
    img: 'https://i.pinimg.com/474x/bd/0c/bd/bd0cbdf7669d1ba0983f44d161552f6f.jpg',
    title: 'Bike',
  },
];
