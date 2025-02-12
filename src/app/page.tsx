import { Hero } from '@/components/hero';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { ParkList } from '@/components/park-list';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Hero />
      {/* <ParkList /> */}

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* 左側：　地図表示エリア */}
        <div className="lg:col-span-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">近くの公園を探す</h2>
          </div>
          <Card className="h-[500px] shadow-lg">
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">地図がここに表示されます</p>
            </div>
          </Card>
        </div>

        {/* 公園リスト */}
        <div className="lg:col-span-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">公園リスト</h2>
          </div>
          <Card className="shadow-lg">
            <div className="bg-green-50 p-3 border-b">
              <h3 className="text-lg font-medium text-green-800">近くの公園</h3>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-4">
                {[
                  { name: '中央公園', address: '東京都新宿区西新宿' },
                  { name: '浜町公園', address: '東京都新宿区西新宿' },
                  { name: '代々木公園', address: '東京都新宿区西新宿' },
                ].map((park, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Avatar className="h-16 w-16 rounded-md">
                      <span className="sr-only">Park image</span>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900">{park.name}</h4>
                      <p className="text-sm text-gray-500">{park.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
