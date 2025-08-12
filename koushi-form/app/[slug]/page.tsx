import { notFound } from 'next/navigation';
import { UNITS } from '@/types/unit';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FormContainer } from '@/components/form/FormContainer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UnitFormPage({ params }: PageProps) {
  const { slug } = await params;
  const unit = UNITS[slug];

  if (!unit) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header unitName={unit.name} />
      
      <main>
        <FormContainer unit={unit} />
      </main>
      
      <Footer />
    </div>
  );
}