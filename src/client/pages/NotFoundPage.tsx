import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/Card';
import { Button } from '@/client/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden bg-gray-950 text-white">
      <div className="flex items-center justify-center min-h-full flex-1 p-4">
        <Card className="w-full max-w-sm mx-auto bg-gray-900 border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold">404</CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center gap-8">
            <p className="text-gray-400 text-center">
              Page not found
            </p>
            <Link to="/" className="w-full">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white border-0">
                Go home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
