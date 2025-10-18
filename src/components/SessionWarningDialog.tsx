import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

interface SessionWarningDialogProps {
  isOpen: boolean;
  onExtendSession: () => void;
  onLogout: () => void;
  remainingTime: number; // in milliseconds
}

export default function SessionWarningDialog({
  isOpen,
  onExtendSession,
  onLogout,
  remainingTime
}: SessionWarningDialogProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          onLogout();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  useEffect(() => {
    setTimeLeft(remainingTime);
  }, [remainingTime]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Session Expiring Soon
          </DialogTitle>
          <DialogDescription className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-lg font-mono font-semibold text-amber-600">
                {formatTime(timeLeft)}
              </span>
            </div>
            Your session will expire soon due to inactivity. Would you like to extend your session?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Sign Out
          </Button>
          <Button 
            onClick={onExtendSession}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Stay Signed In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
