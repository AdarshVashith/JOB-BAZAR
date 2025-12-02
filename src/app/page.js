import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Workin
          </h1>
          <p className="text-xl text-gray-600">
            Your job search platform
          </p>
        </div>
      </main>
    </div>
  );
}
