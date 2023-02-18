//
//  DailyPracticeView.swift
//  PocketCards
//
//  Created by macmini on 2022/11/16.
//
//

import SwiftUI

struct DailyPracticeView: View {
    var interactor: DailyPracticeBusinessLogic?

    @ObservedObject var viewModel = DailyPracticeViewModel()

    var body: some View {
        VStack {
            if viewModel.isLoading {
                Text("Loading....")
            } else if viewModel.isFinish {
                Text("学習は終わりました")
                    .font(.system(size: 64, design: .default))
            } else {
                if let question = viewModel.question {
                    if question.choices != nil {
                        ChoiceQuestion(
                            question: question,
                            isShowError: viewModel.isShowError,
                            onChoice: interactor!.onChoice
                        )
                    } else {
                        // Society or Science
                        FlashCard(question: question, action: interactor!.onAction)
                    }
                } else {
                    Text("想定外のエラーが発生しました。")
                }
            }
        }.onDisappear {
//            viewModel.question = nil
//            viewModel.isLoading = true
//            interactor?.destory()
        }
    }
}

extension DailyPracticeView: DailyPracticeDisplayLogic {
    func showNext(model: DailyPracticeViewModel) {
        DispatchQueue.main.async {
            self.viewModel.isLoading = model.isLoading
            self.viewModel.isFinish = model.isFinish
            self.viewModel.isShowError = model.isShowError
            self.viewModel.question = model.question
        }
    }

    func onUpdate(model: DailyPracticeViewModel) {
        DispatchQueue.main.async {
            viewModel.isLoading = model.isLoading
            viewModel.isFinish = model.isFinish
            viewModel.isShowError = model.isShowError
        }
    }
}

extension DailyPracticeView {
    func configureView(loadUrl: String, subject: String, mode: String) -> some View {
        var view = self
        view.viewModel.isLoading = true

        let interactor = DailyPracticeInteractor(loadUrl: loadUrl, subject: subject, mode: mode)
        let presenter = DailyPracticePresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        debugPrint(configureView, loadUrl, subject, mode)

        Task {
            await interactor.initialize()
        }

        return view
    }
}

struct DailyPracticeView_Previews: PreviewProvider {
    static var previews: some View {
        DailyPracticeView()
    }
}
