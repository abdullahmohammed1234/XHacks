'use client';

import { NostalgiaBackground } from '@/components/features/nostalgia-background';
import { AnimatedSection } from '@/components/features/animated-section';
import Link from "next/link";
import { Button } from '@/components/ui/button';

export default function YearsPage() {
  return (
    <NostalgiaBackground showFloatingYears>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/*File Upload*/}
          <AnimatedSection animation = "fadeUp">
            <div className="text-center mb-12">
              <Link href="/fileUpload">
                <Button size="lg" className="text-lg px-8">
                  Upload File
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          
        </div>
      </div>
    </NostalgiaBackground>
  );
}
