import { LucideIcon } from "lucide-react";

type TileData = {
  label: string;
  value: number;
};

type DashboardTileProps = {
  icon: LucideIcon;
  title: string;
  data: TileData[];
  bgColor: string;
};

export function DashboardTile({ icon: Icon, title, data, bgColor }: DashboardTileProps) {
  const mainValue = data.reduce((acc, item) => acc + item.value, 0);
  return (
    <div className={`rounded-lg ${bgColor} p-6 shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <Icon className="mb-4 h-12 w-12" />
          <h3 className="mb-4 text-4xl font-bold">{mainValue}</h3>
          <p className="text-lg font-semibold">{title}</p>
        </div>
        <div className="text-right">
          {data.map((item, index) => (
            <p key={index} className="mb-2">
              {item.label}: <span className="text-2xl font-bold">{item.value}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
