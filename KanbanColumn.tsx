import React from 'react';
import { ProjectTask, TaskStatus, Statuses } from '../../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
    title: string;
    tasks: ProjectTask[];
    statuses: Statuses;
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    disabled: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, statuses, onStatusChange, disabled }) => {
    const columnColors: Record<string, string> = {
        'Por Hacer': 'bg-neutral-200',
        'En Progreso': 'bg-blue-200',
        'Hecho': 'bg-green-200',
    };
    return (
        <div className="flex-1 bg-neutral-100 rounded-lg p-3 min-w-[280px]">
            <h4 className={`font-semibold text-center text-neutral-700 mb-3 p-2 rounded-md ${columnColors[title as TaskStatus]}`}>{title}</h4>
            <div className="space-y-3 h-[400px] overflow-y-auto p-1">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} status={statuses[task.id]} onStatusChange={onStatusChange} disabled={disabled} />
                ))}
            </div>
        </div>
    );
};