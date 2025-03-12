import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  featuredImage: string;
  categories: string[];
}

export default function ProjectCard({ slug, title, description, featuredImage, categories }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={featuredImage}
          alt={title}
          width={500}
          height={300}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhQJ/h3QdYQAAAABJRU5ErkJggg=="
        />
      </div>
      <div className="p-6">
        <div className="mb-2 flex gap-2">
          {categories.map((category, i) => (
            <span key={i} className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {category}
            </span>
          ))}
        </div>
        <h3 className="mb-2 text-xl font-normal">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
} 