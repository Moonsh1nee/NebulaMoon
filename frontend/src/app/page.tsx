'use client';

import { observer } from 'mobx-react-lite';
import { RootStore } from '@/store/rootStore';

// Создаем стор
const store = new RootStore();

const Home = observer(() => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">NebulaMoon</h1>
            {store.loading && <p>Loading...</p>}
            {store.error && <p className="text-red-500">{store.error}</p>}
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Fields</h2>
                <ul className="list-disc pl-5">
                    {store.fields.map((field) => (
                        <li key={field._id}>
                            {field.name} ({field.type})
                            {field.options.length > 0 && `: ${field.options.join(', ')}`}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Tasks</h2>
                <ul className="list-disc pl-5">
                    {store.tasks.map((task) => (
                        <li key={task._id}>
                            {task.title}
                            <ul className="list-circle pl-5">
                                {task.fields.map((field, index) => (
                                    <li key={index}>
                                        {field.fieldId.name}: {JSON.stringify(field.value)}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
});

export default Home;