export default function Page({ params }: { params: { repoId: string } }) {
  return <h1>My Page{params.repoId}</h1>
}