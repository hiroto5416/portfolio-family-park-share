import { Hero } from '@/components/hero';
import { GoogleMapComponent } from '@/components/map/GoogleMap';
import { ParkList } from '@/components/park-list';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { ParkList } from '@/components/park-list';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Hero />
      <div className="mt-8">
        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* 左側：　地図表示エリア */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">近くの公園を探す</h2>
            </div>
            <Card className="h-[500px] shadow-lg">
              <GoogleMapComponent />
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
              <ScrollArea className="h-[450px]">
                <div className="p-4">
                  <ParkList />
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
