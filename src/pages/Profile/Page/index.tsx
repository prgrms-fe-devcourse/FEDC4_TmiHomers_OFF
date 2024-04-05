import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/api/User';
import BackButton from '@/components/BackButton';
import Tabs from '@/components/Tabs';
import DropdownMenu from '@/pages/ProfilePage/DropdownMenu';
import FollowButton from '@/pages/ProfilePage/FollowButton';
import RenderLikedArticles from '@/pages/ProfilePage/RenderLikedArticles';
import RenderUserArticles from '@/pages/ProfilePage/RenderUserArticles';
import BottomNavigation from '@components/BottomNavigation';
import ScrollToTopButton from '@components/ScrollToTopButton';
import SubscribeInfo from '@components/SubscribeInfo';
import useAuthQuery from '@hooks/useAuthQuery';
import useImageMutation from '@hooks/useImageMutation';
import useScrollToTop from '@hooks/useScrollToTop';
import { useToastContext } from '@hooks/useToastContext';
import NoResult from '../NoResult';
import UserAvatar from '../UserAvatar';
import { getFollowCounts } from '../utils/getFollowCounts';

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/');
  const profileId = pathSegments[2];
  const lastSegment = pathSegments[pathSegments.length - 1];

  const {
    userQuery: { data: user },
    logoutQuery: { mutate: logoutMutate },
  } = useAuthQuery();
  const { data: userInfo } = useQuery(['userInfo', lastSegment], () => fetchUser(lastSegment));

  const { showToast } = useToastContext();
  const { ref, showScrollToTopButton, scrollToTop } = useScrollToTop();
  const isMyProfile = user ? user._id === userInfo?._id : false;
  const [userInfoPosts, setUserInfoPosts] = useState(userInfo?.posts || []);
  const [likeArticlesIds, setLikeArticlesIds] = useState(
    userInfo?.likes.map((like) => like.post) || [],
  );
  const { followingCount, followerCount } = getFollowCounts({ userInfo });

  const userImageMutation = useImageMutation({
    queryKey: ['userInfo', lastSegment],
    showToast,
  });

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files;

    if (!imageFile || imageFile.length < 0) {
      return;
    }

    userImageMutation.mutate(imageFile[0]);
  };

  useEffect(() => {
    if (userInfo) {
      setUserInfoPosts(() => [...userInfo.posts]);
      setLikeArticlesIds(() => [...userInfo.likes.map((like) => like.post)]);
    }
  }, [userInfo]);

  return (
    <Tabs defaultValue="written">
      <section className="flex flex-col h-screen w-screen max-w-[25.875rem] font-Cafe24SurroundAir overflow-hidden text-wall-street ">
        <header className="flex flex-col gap-4 items-center pt-12">
          <div className="w-full flex justify-between items-center pl-10 pr-10">
            <BackButton
              onClick={() => {
                navigate(-1);
              }}
            />
            {isMyProfile && <DropdownMenu logoutMutate={logoutMutate} />}
            {!isMyProfile && <FollowButton user={user} profileId={profileId} />}
          </div>
          <UserAvatar
            onChangePencil={handleUploadImage}
            isLoggedIn={isMyProfile}
            width={8}
            profileImage={userInfo?.image}
          />
          <div className="flex flex-col gap-1 items-center pt-3">
            <div>
              <span className="font-Cafe24Surround text-[1.375rem] pr-1 text-tricorn-black">
                {userInfo?.fullName}
              </span>
              <span className="text-[0.875rem]">기자</span>
            </div>
            <SubscribeInfo subscriber={followerCount} subscribing={followingCount} />
          </div>
          <span>{userInfo ? userInfo.username : '자기소개가 없습니다.'}</span>
          <Tabs.List>
            <Tabs.Tab value="written">작성한 기사</Tabs.Tab>
            <Tabs.Tab value="liked">응원한 기사</Tabs.Tab>
          </Tabs.List>
        </header>
        <article ref={ref} className="flex-grow overflow-y-auto">
          <Tabs.Panel value="written">
            {userInfoPosts && userInfoPosts.length > 0 ? (
              <RenderUserArticles posts={userInfoPosts} />
            ) : (
              <NoResult label="작성한 기사" />
            )}
          </Tabs.Panel>
          <Tabs.Panel value="liked">
            {likeArticlesIds && likeArticlesIds.length > 0 ? (
              <RenderLikedArticles postIds={likeArticlesIds} />
            ) : (
              <NoResult label="응원한 기사" />
            )}
          </Tabs.Panel>
          <ScrollToTopButton show={showScrollToTopButton} onClick={scrollToTop} />
        </article>
        <div className="flex justify-center flex-none w-full">
          <BottomNavigation currentPage={'/profile'} />
        </div>
      </section>
    </Tabs>
  );
};

export default ProfilePage;
