'use client';

import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PatientsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg text-center">
        <CardContent className="py-16">
          <div className="size-16 rounded-2xl bg-slate-100 text-slate-400 grid place-items-center mx-auto mb-6">
            <Users size={28} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Patient management and profiles will appear here. Coming in the next update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
