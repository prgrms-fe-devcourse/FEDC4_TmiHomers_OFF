import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { BsFire } from 'react-icons/bs';
import { MdOutlineSearch, MdStars } from 'react-icons/md';
import BottomNavigation from '@/components/BottomNavigation';
import Article from '@components/Article';
import Articles from '@components/Articles';
import HeaderText from '@components/HeaderText';
import Loader from '@components/Loader';
import Tab from '@components/Tab';
import TabItem from '@components/TabItem';
import { TabConstants } from '@constants/Tab';
import { TabContextProvider } from '@context/TabContext';
import { useArticles } from '@hooks/useArticles';
import { useFilteredArticles } from '@hooks/useFilteredArticles';

const ArticlesPage = () => {
  const { data: articles, isFetching } = useArticles();
  const newestArticles = useFilteredArticles(TabConstants.NEWEST, articles);
  // const hottestArticles = useFilteredArticles(TabConstants.HOTTEST, articles);
  // const subscribedArticles = useFilteredArticles(TabConstants.SUBSCRIBED, articles);

  const navigate = useNavigate();
  const articleTagRef = useRef<HTMLDivElement>(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  const scrollToTop = () => {
    if (articleTagRef.current) {
      articleTagRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const currentRef = articleTagRef.current;
    const handleScroll = () => {
      const scrollPosition = currentRef?.scrollTop || 0;
      if (scrollPosition > 0) {
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    };
    currentRef?.addEventListener('scroll', handleScroll);
    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <TabContextProvider>
      <section className="max-w-[25.875rem] mx-auto h-screen flex flex-col relative">
        <header className="flex flex-col bg-white pt-[2.75rem]">
          <div className="flex justify-between mb-[1.75rem] ml-[2.44rem] mr-[1.56rem]">
            <HeaderText label="뉴스" />
            <MdOutlineSearch
              className="w-[1.8rem] h-[1.8rem] cursor-pointer"
              onClick={() => {
                navigate('/search');
              }}
            />
          </div>
          <Tab
            active="item1"
            maxWidth="25.875"
            tabItems={[
              { title: `${TabConstants.NEWEST}`, width: '8.625' },
              {
                title: `${TabConstants.HOTTEST}`,
                icon: <BsFire className="w-[1.3rem] h-[1.3rem]" />,
                width: '8.625',
              },
              {
                title: `${TabConstants.SUBSCRIBED}`,
                icon: <MdStars className="w-[1.5rem] h-[1.5rem]" />,
                width: '8.625',
              },
            ]}
          />
        </header>
        <article ref={articleTagRef} className="flex-grow gap-4 overflow-y-auto pb-[4.75rem] ">
          <TabItem title={`${TabConstants.NEWEST}`} index="item1">
            {isFetching ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              <Articles articles={newestArticles} />
            )}
          </TabItem>
          <TabItem title={`${TabConstants.HOTTEST}`} index="item2">
            <Article
              id="1"
              title="(임시)이거슨 뜨겁다."
              nickname="@hot-guys"
              postedDate="2023-09-14T09:28:39.390Z"
              hasImage={false}
              likes={15}
              comments={42}
            />
          </TabItem>
          <TabItem title={`${TabConstants.SUBSCRIBED}`} index="item3">
            <Article
              id="1"
              title="(임시)이거슨 구독이다."
              nickname="@sub-scriber"
              postedDate="2023-09-14T09:28:39.390Z"
              hasImage={false}
              likes={12}
              comments={42}
            />
          </TabItem>
          <button
            onClick={scrollToTop}
            disabled={!showScrollToTopButton}
            className={`absolute p-2 flex items-center justify-center text-white w-[3.5rem] h-[3.5rem] bg-cooled-blue drop-shadow-[0_0.25rem_0.25rem_rgba(0,0,0,0.25)] transition-opacity duration-300 ease-in-out ${
              showScrollToTopButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } rounded-full bottom-24 right-4`}
          >
            <AiOutlineArrowUp className="w-[1.5rem] h-[1.5rem]" />
          </button>
        </article>
        <BottomNavigation currentPage="/news" />
      </section>
    </TabContextProvider>
  );
};

export default ArticlesPage;
