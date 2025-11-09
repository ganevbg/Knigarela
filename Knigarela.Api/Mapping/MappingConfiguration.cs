using AutoMapper;
using Knigarela.Api.Dtos.Boxes;
using Knigarela.Core.Entities;

namespace Knigarela.Api.Mapping
{
    public class MappingConfiguration : Profile
    {
        public MappingConfiguration()
        {
            CreateMap<Box, BoxDto>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => src.Images.Where(x => !x.IsMain).OrderBy(x => x.SortOrder).Select(i => i.Url)))
                .ForMember(dest => dest.MainImageUrl, opt => opt.MapFrom(src => src.Images.FirstOrDefault(i => i.IsMain)!.Url));

            CreateMap<UpsertBoxDto, Box>();
            CreateMap<Box, ActiveBoxDto>()
                .ForMember(dest => dest.Description,
                    opt => opt.MapFrom(src => src.Description.Length > 200 ? $"{src.Description.Substring(0, 200)}..." : src.Description))
                .ForMember(dest => dest.MainImageUrl,
                    opt => opt.MapFrom(src => src.Images.FirstOrDefault(i => i.IsMain)!.Url));

            CreateMap<Box, PrevBoxDto>()
               .ForMember(dest => dest.MainImageUrl,
                   opt => opt.MapFrom(src => src.Images.FirstOrDefault(i => i.IsMain)!.Url));
            
        }
    }
}
