import { Bell, Trash2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { notificationConfig } from '@/types/notification';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notificationId: string, link?: string) => {
    markAsRead(notificationId);
    if (link) {
      navigate(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn(
            "h-5 w-5 transition-all",
            unreadCount > 0 && "animate-pulse"
          )} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 p-2">
              {notifications.map((notification) => {
                const config = notificationConfig[notification.type];
                const isUnread = !notification.read;
                
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex flex-col items-start p-4 cursor-pointer rounded-lg",
                      isUnread 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-muted/30 hover:bg-muted/50'
                    )}
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                  >
                    <div className="flex items-start justify-between w-full gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-lg mt-0.5 shrink-0">{config.icon}</span>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className={cn(
                            "text-sm font-semibold",
                            isUnread ? "text-white" : "text-foreground"
                          )}>
                            {notification.title}
                          </p>
                          <p className={cn(
                            "text-sm line-clamp-2",
                            isUnread ? "text-white/90" : "text-muted-foreground"
                          )}>
                            {notification.message}
                          </p>
                          <p className={cn(
                            "text-xs",
                            isUnread ? "text-white/70" : "text-muted-foreground/70"
                          )}>
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 shrink-0",
                          isUnread 
                            ? "text-white/70 hover:text-white hover:bg-white/20" 
                            : "text-muted-foreground hover:text-destructive"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
