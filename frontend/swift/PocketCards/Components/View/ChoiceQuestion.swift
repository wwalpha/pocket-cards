//
//  ChoiceQuestion.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Kingfisher
import SwiftUI

struct ChoiceQuestion: View {
    var question: Question
    var isShowError: String
    var onChoice: (_: String) -> Void

    var body: some View {
        let qImage = question.title.getImage()

        VStack {
            HStack {
                GeometryReader { _ in
                    VStack {
                        Text(question.title.removeImage())

                        if !qImage.isEmpty {
                            // if file locally exist
                            if FileManager.default.fileExists(fileName: qImage) {
                                Image(uiImage: FileManager.default.loadImage(fileName: qImage)!)
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            } else {
                                // download image
                                let _ = DownloadManager.default.downloadFile(path: qImage)

                                KFImage(URL(string: DOMAIN_HOST + question.title.getImage())!)
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                    .font(.system(size: 48, design: .default))
                    .padding(.leading, 32)
                    .border(Color.purple, width: 5)
                }
            }
            .padding(.bottom, 8)
            .padding(.top, 8)

            ForEach(0 ..< question.choices!.count, id: \.self) { idx in
                let item = question.choices![idx]
                let index = String(idx + 1)
                let isError: Bool = !self.isShowError.isEmpty ? self.isShowError == index : false

                ChoiceButton(text: item, isError: isError) {
                    self.onChoice(index)
                }
            }
        }
        .padding(.horizontal, 32)
        .padding(.vertical, 16)
    }
}

struct ChoiceQuestion_Previews: PreviewProvider {
    static var previews: some View {
        ChoiceQuestion(question: Question(id: "", groupId: "", title: "AAAA", choices: ["AAA", "BBBBB", "CCCCC", "DDDDD"], answer: "BBBB"), isShowError: "AAA", onChoice: { data in
            debugPrint(data)
        })
        .previewInterfaceOrientation(.landscapeLeft)
    }
}
