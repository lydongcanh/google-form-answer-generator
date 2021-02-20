using System.Collections.Generic;

namespace GoogleFormAnswerGenerator.Models.GoogleForm
{
    public class GoogleFormPostRequest
    {
        public string FormUrl { get; set; }

        public Dictionary<string, string> Fields { get; set; }

        public Dictionary<string, string[]> Checkboxes { get; set; }
    }
}
