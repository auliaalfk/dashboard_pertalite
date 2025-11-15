import { Users, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

const teamMembers = [
  {
    name: 'Nama Anggota 1',
    nrp: '5026221001',
    role: 'Data Analyst & Frontend Developer',
    email: 'member1@email.com',
    photo: 'team member 1'
  },
  {
    name: 'Nama Anggota 2',
    nrp: '5026221002',
    role: 'Machine Learning Engineer',
    email: 'member2@email.com',
    photo: 'team member 2'
  },
  {
    name: 'Nama Anggota 3',
    nrp: '5026221003',
    role: 'Data Scientist',
    email: 'member3@email.com',
    photo: 'team member 3'
  },
  {
    name: 'Nama Anggota 4',
    nrp: '5026221004',
    role: 'NLP Specialist',
    email: 'member4@email.com',
    photo: 'team member 4'
  },
  {
    name: 'Nama Anggota 5',
    nrp: '5026221005',
    role: 'UI/UX Designer',
    email: 'member5@email.com',
    photo: 'team member 5'
  },
];

export function About() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-2">
          Tentang Tim
        </h1>
      </div>

      {/* Project Info */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="size-5 text-purple-500" />
            Tentang Proyek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-900 mb-2">Pertalite Social Media Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Platform analisis komprehensif untuk menganalisis sentimen, topik, dan emoji dari komentar TikTok 
                terkait Pertalite. Proyek ini menggunakan teknik Natural Language Processing (NLP) dan Machine Learning 
                untuk memberikan insights mendalam tentang persepsi publik terhadap Pertalite di media sosial.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <p className="text-sm text-gray-600 mb-1">Dataset</p>
                <p className="text-gray-900">1,769 Komentar</p>
                <p className="text-xs text-purple-600 mt-1">TikTok Data</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-orange-50">
                <p className="text-sm text-gray-600 mb-1">Total Engagement</p>
                <p className="text-gray-900">76,290 Likes</p>
                <p className="text-xs text-pink-600 mt-1">Community Interaction</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50">
                <p className="text-sm text-gray-600 mb-1">Analysis Period</p>
                <p className="text-gray-900">31 Okt - 9 Nov</p>
                <p className="text-xs text-orange-600 mt-1">2025</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-pink-500" />
            Anggota Tim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 hover:shadow-lg transition-all border border-purple-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="size-24 rounded-full overflow-hidden mb-4 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    <ImageWithFallback 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                      alt={member.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <h3 className="text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-purple-600 mb-1">NRP: {member.nrp}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-8">
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'NLTK', 'React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'TikTok API'].map((tech, index) => (
              <span 
                key={index}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}