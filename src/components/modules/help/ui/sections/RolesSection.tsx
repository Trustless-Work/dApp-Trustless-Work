import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  actionIcons,
  roleActions,
} from "@/constants/role-actions/role-actions.constant";

export const RolesSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
      {roleActions.map((item) => (
        <div key={item.role} className="border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`rounded-full p-3 ${item.color} shadow-sm text-muted-foreground dark:text-black`}
            >
              {item.icon}
            </div>
            <h2 className="text-lg font-semibold">{item.label}</h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Actions:
            </h3>
            <ul className="space-y-2">
              {item.actions.map((action) => (
                <li key={action} className="flex items-center gap-2 text-sm">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="rounded-full text-muted-foreground p-1.5 shadow-2xl">
                          {actionIcons[action]}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{action}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
