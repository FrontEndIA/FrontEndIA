using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace FrontEndIA.Pages
{
    public class IndexModelRuben : PageModel
    {
        private readonly ILogger<IndexModelRuben> _logger;

        public IndexModelRuben(ILogger<IndexModelRuben> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}
