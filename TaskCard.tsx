import React from 'react';
import { ProjectTask, TaskStatus } from '../../types';
import Button from '../ui/Button';

interface TaskCardProps {
    task: ProjectTask;
    status: TaskStatus;
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    disabled: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, status, onStatusChange, disabled }) => {
    const priorityColors: Record<string, string> = {
        'Alta': 'bg-red-100 text-red-800 border-red-400',
        'Media': 'bg-yellow-100 text-yellow-800 border-yellow-400',
        'Baja': 'bg-blue-100 text-blue-800 border-blue-400',
    };
    return (
        <div className="bg-white p-3 rounded-lg shadow border border-neutral-200 space-y-2">
            <h5 className="font-semibold text-neutral-800">{task.name}</h5>
            <p className="text-sm text-neutral-600">{task.description}</p>
            <div className="flex justify-between items-center text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                <span className="text-neutral-500">{task.estimatedHours} horas</span>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
                {(['Por Hacer', 'En Progreso', 'Hecho'] as TaskStatus[]).map(s => (
                    s !== status && <Button key={s} size="sm" variant="outline" onClick={() => onStatusChange(task.id, s)} disabled={disabled}>{s}</Button>
                ))}
            </div>
        </div>
    );
};