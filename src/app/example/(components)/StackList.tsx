//This could be either client or server component.

const MAIN_STACKS = ["Next.js 14", "Vercel Postgres", "NextAuth 5 (Okta, Google)", "Tailwind", "Typescript"];
const SUB_STACKS = ["NPM", "shadcn/ui", "ESLint", "Prettier", "Drizzle", "Zustand(if needed)"];

const StackList = () => {
  return (
    <div className="mb-10 max-w-screen-sm text-center">
      <div className="text-xl">Stack List</div>
      <div>how to use array + map</div>
      <h1 className="flex flex-col items-start text-2xl font-bold text-green-600">
        {MAIN_STACKS.map((stack, i) => (
          <div key={i}>{stack}</div>
        ))}
      </h1>
      <h1 className="flex flex-col items-start text-xl ">
        {SUB_STACKS.map((stack, i) => (
          <div key={i}>{stack}</div>
        ))}
      </h1>
    </div>
  );
};

export default StackList;
