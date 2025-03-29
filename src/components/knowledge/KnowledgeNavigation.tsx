
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export function KnowledgeNavigation() {
  return (
    <div className="mb-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/knowledge">Knowledge Base</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Maintenance</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      to="/knowledge?category=maintenance"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Maintenance Guides
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Comprehensive guides to maintain your Unimog in optimal condition
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem to="/knowledge?topic=engine" title="Engine Maintenance">
                  Learn about engine maintenance schedules and best practices
                </ListItem>
                <ListItem to="/knowledge?topic=hydraulics" title="Hydraulic Systems">
                  Maintenance tips for hydraulic components and fluids
                </ListItem>
                <ListItem to="/knowledge?topic=electrical" title="Electrical Systems">
                  Troubleshooting and maintenance of electrical components
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Repair</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2">
                <ListItem to="/knowledge?topic=engine-repair" title="Engine Repair">
                  Step-by-step guides for common engine repairs
                </ListItem>
                <ListItem to="/knowledge?topic=transmission" title="Transmission">
                  Diagnostics and repairs for transmission issues
                </ListItem>
                <ListItem to="/knowledge?topic=brake-system" title="Brake System">
                  Brake repair and replacement procedures
                </ListItem>
                <ListItem to="/knowledge?topic=axles" title="Axles & Drivetrain">
                  Repair guides for axles and drivetrain components
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Adventures</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2">
                <ListItem to="/knowledge?topic=off-road" title="Off-Road Techniques">
                  Master off-road driving with your Unimog
                </ListItem>
                <ListItem to="/knowledge?topic=expedition" title="Expedition Planning">
                  Plan your next overland adventure
                </ListItem>
                <ListItem to="/knowledge?topic=accessories" title="Accessories & Gear">
                  Essential accessories for adventure travel
                </ListItem>
                <ListItem to="/knowledge?topic=recovery" title="Recovery Techniques">
                  Self-recovery methods and equipment
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/knowledge?category=modifications">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Modifications
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  to: string;
  title: string;
}

const ListItem = ({ to, title, children, className, ...props }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
