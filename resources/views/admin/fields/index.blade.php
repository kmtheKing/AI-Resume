<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Fields of Work Administration') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <div style="margin-bottom: 20px;">
                        <a href="{{ route('fields.create') }}" style="padding: 10px 15px; background: #007bff; color: white; border-radius: 5px; text-decoration: none;">Add New Field</a>
                    </div>
                    
                    <table style="width: 100%; text-align: left; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 2px solid #ddd;">
                                <th style="padding: 10px;">ID</th>
                                <th style="padding: 10px;">Name</th>
                                <th style="padding: 10px;">Description</th>
                                <th style="padding: 10px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($fields as $field)
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 10px;">{{ $field->id }}</td>
                                <td style="padding: 10px; font-weight: bold;">{{ $field->name }}</td>
                                <td style="padding: 10px;">{{ $field->description }}</td>
                                <td style="padding: 10px;">
                                    <a href="{{ route('fields.edit', $field) }}" style="color: blue; margin-right: 15px;">Edit</a>
                                    <form action="{{ route('fields.destroy', $field) }}" method="POST" style="display: inline;" onsubmit="return confirm('Delete this field?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" style="color: red; background: none; border: none; cursor: pointer; text-decoration: underline;">Delete</button>
                                    </form>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
