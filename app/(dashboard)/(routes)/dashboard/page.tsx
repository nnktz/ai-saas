import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      Home page
      <div>
        <UserButton afterSignOutUrl='/' />
      </div>
    </div>
  );
}