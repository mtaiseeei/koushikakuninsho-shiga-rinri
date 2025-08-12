import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UNITS } from '@/types/unit';
import Link from 'next/link';

export default function Home() {
  const unitList = Object.values(UNITS);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Container>
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                単会を選択してください
              </h2>
              <p className="text-gray-600">
                該当する倫理法人会を選択して講師確認書フォームにアクセスしてください
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {unitList.map((unit) => (
                <Card key={unit.slug} className="hover:scale-105 transition-transform duration-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {unit.name}
                    </h3>
                    <Link href={`/${unit.slug}`}>
                      <Button variant="primary" className="w-full">
                        フォームを開く
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
}
