import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type IntroductionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const IntroductionModal = ({ isOpen, onClose }: IntroductionModalProps) => {
  const introductionData = [
    {
      title: 'アプリの紹介',
      description:
        'このアプリは、家族や友人と公園の情報を共有できるプラットフォームです。お気に入りの公園を登録し、レビューしたり、みんなの評価を見たりすることができます。',
    },
    {
      title: '使い方ガイド',
      description:
        '地図から公園を検索したり、リストから興味のある公園を探せます。レビューを投稿して、他のユーザーと情報を共有しましょう。お気に入りの公園を登録すれば、いつでも簡単にアクセスできます。',
    },
    {
      title: '機能について',
      description:
        '公園検索、レビュー投稿、お気に入り登録、写真アップロードなど、様々な機能を利用できます。友達を招待して、一緒に公園の情報を共有しましょう！',
    },
  ];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">FAMILY PARK SHAREガイド</DialogTitle>
        </DialogHeader>
        <Carousel>
          <CarouselContent>
            {introductionData.map((item, index) => (
              <CarouselItem key={index}>
                <Card className="border-none shadow-none">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    <CardDescription className="text-center text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <DialogFooter className="flex justify-center mt-4">
          <Button onClick={onClose}>はじめる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntroductionModal;
